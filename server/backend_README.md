# Chat Application System Design

## 1. Overview

This document describes the architecture and system design of the real-time chat application.

The system supports:

* Private conversations
* Group conversations
* Real-time messaging
* Typing indicators
* Online/offline presence
* Delivery receipts
* Read receipts
* Offline message synchronization
* Group management
* Offline notifications

The architecture follows a hybrid model:

* HTTP APIs for persistent operations
* WebSocket(Socket.IO) for real-time communication
* PostgreSQL for permanent storage
* Redis for temporary high-speed state

---

# 2. High Level Architecture

```
                  Clients
                     |
          -------------------------
          |                       |
        HTTP                  WebSocket
          |                       |
          |                       |
      Express API             Socket.IO
          |                       |
          |                       |
      PostgreSQL                Rooms
          |
          |
        Redis
```

## Components

### Express API

Responsible for:

* Authentication
* Creating conversations
* Fetching messages
* Group operations
* Sync APIs
* Notification APIs

### Socket.IO Server

Responsible for:

* Real-time messages
* Typing events
* Presence updates
* Receipt updates
* Group event broadcasting

### PostgreSQL

Stores permanent data:

* Users
* Conversations
* Messages
* Receipts
* Notifications

### Redis

Stores temporary high-frequency data:

* Online users
* Socket mappings
* Presence state
* Future pub/sub scaling

---

# 3. Database Design

Main entities:

```
User

Conversation

ConversationMember

Message

MessageDeliveryReceipt

MessageReadReceipt

Notification
```

---

# 4. Conversation Design

A conversation represents any chat.

Conversation types:

```
PRIVATE

GROUP
```

## Private Conversation

Example:

```
User A <----> User B
```

Database:

Conversation:

```
id: 123
type: PRIVATE
```

Members:

```
conversationId     userId

123                A

123                B
```

Messages:

```
messageId
conversationId
senderId
content
```

---

## Group Conversation

Example:

```
Backend Developers

A
B
C
D
```

Conversation:

```
id:999
type:GROUP
name:"Backend Developers"
```

Members:

```
conversationId   userId      role

999              A           ADMIN

999              B           MEMBER

999              C           MEMBER

999              D           MEMBER
```

All messages reference:

```
conversationId
```

not groupId.

This allows private and group chat to share the same message system.

---

# 5. ConversationMember Design

ConversationMember represents a user's state inside a conversation.

Fields:

```
conversationId

userId

role

joinedAt

leftAt

lastReadAt

lastSeenAt

unreadCount
```

Used for:

## Group roles

```
ADMIN
MEMBER
```

## Leaving groups

Users are not deleted.

Instead:

```
leftAt = timestamp
```

This preserves:

* Message history
* Audit information
* Previous membership

---

# 6. Socket Architecture

Socket connection lifecycle:

```
Client

 |
 |
socket.connect()

 |
 |
Authentication middleware

 |
 |
socket.data.user

 |
 |
Join personal room

 |
 |
Register handlers
```

---

# 7. Socket Rooms

## Personal Room

Every user joins their own room:

```
socket.join(userId)
```

Example:

```
Room:

user-A-id

Socket A
```

Purpose:

Send private events:

* New group notification
* Removed from group
* Direct notifications

---

## Conversation Room

When user opens chat:

Client:

```
join_conversation(conversationId)
```

Server:

```
socket.join(conversationId)
```

Example:

```
Room: conversation123


Socket A

Socket B

Socket C
```

Broadcast:

```
io.to(conversationId)
.emit(event)
```

---

# 8. Message Flow

## Sending Message

```
User A

 |
 |
send_message

 |
 |
Socket.IO

 |
 |
createMessage()

 |
 |
PostgreSQL

 |
 |
io.to(conversationId)

 |
 |
new_message

 |
 |
Users receive message
```

---

# 9. Typing System

Typing is temporary.

It is NOT stored.

Flow:

```
User A

 |
 |
typing_start

 |
 |
Socket Server

 |
 |
socket.to(room)

 |
 |
Users B,C
```

Events:

```
typing_start

typing_stop
```

No database required.

---

# 10. Presence System

Presence changes frequently.

Therefore Redis is used.

Architecture:

```
Socket Connection

        |

Presence Service

        |

Redis
```

---

When user connects:

Redis:

```
online_users

userId -> socketId
```

When disconnect:

Remove socket.

If no sockets remain:

```
User offline
```

Update PostgreSQL:

```
lastSeenAt
```

---

# 11. Delivery Receipts

Delivery means:

"Message reached the user's device"

Flow:

```
Sender

 |
 |
send message

 |
 |
Database

 |
 |
Receiver gets message

 |
 |
MESSAGE_DELIVERED

 |
 |
Save receipt
```

Database:

```
MessageDeliveryReceipt


messageId

userId

deliveredAt
```

---

# 12. Read Receipts

Read means:

"User opened/read the message"

Flow:

```
User opens conversation

        |

MESSAGE_READ

        |

Create ReadReceipt
```

Database:

```
MessageReadReceipt


messageId

userId

readAt
```

---

Group example:

Message:

```
Hello
```

Receipts:

```
B read

C read

D read
```

---

# 13. Offline Synchronization

Socket events only work when users are online.

Messages must be persisted.

Example:

```
User A sends message

        |

PostgreSQL

        |

User B offline
```

When B reconnects:

```
Connect

 |

Fetch conversations

 |

Sync API

 |

Fetch messages after lastSeenAt

 |

Update UI
```

Query:

```
createdAt > lastSeenAt
```

---

# 14. Offline Events and Notifications

Socket events are temporary.

Offline users cannot receive them.

Example:

```
A adds B to group

B offline
```

Socket:

```
io.to(B)

emit()

```

Nothing happens.

Therefore important events are stored.

---

# 15. Notification System

Notification table:

```
Notification

id

userId

type

conversationId

data

read

createdAt
```

Examples:

```
NEW_GROUP

GROUP_MEMBER_ADDED

GROUP_MEMBER_REMOVED

GROUP_ROLE_UPDATED
```

---

Flow:

```
User Action

     |

Service Layer

     |

Database Notification

     |

If online

     |

Socket Event
```

---

When user reconnects:

```
Connect

 |

GET /notifications

 |

Unread notifications

 |

Display to user
```

---

# 16. Group Event Flow

Example:

Admin adds member.

```
Admin

 |

POST /group/member

 |

Update Database

 |

Create Notification

 |

Socket Emit

       |
       |
 ----------------
 |              |
Online Users   New User

```

Events:

```
GROUP_MEMBER_ADDED

GROUP_MEMBER_REMOVED

GROUP_ROLE_UPDATED

GROUP_MEMBER_LEFT

NEW_GROUP
```

---

# 17. Event Categories

## Ephemeral Events

No persistence.

Examples:

```
typing_start

typing_stop

online

offline
```

---

## Persistent Events

Require storage.

Examples:

```
messages

group changes

notifications

receipts
```

---

# 18. Scaling Architecture

Current:

```
Client

 |

Node Server

 |

PostgreSQL

 |

Redis
```

---

Future:

Multiple servers:

```
             Load Balancer

                   |

        ---------------------

        |          |        |

      Node1      Node2    Node3


                   |

              Redis Adapter


                   |

                Redis

```

Socket.IO Redis adapter synchronizes rooms between servers.

---

# 19. Kafka Future Architecture

At large scale:

```
Message Service

      |

    Kafka

      |

----------------------

Notification

Analytics

Search

Push Service
```

Kafka is useful when:

* Millions of events
* Multiple consumers
* Event replay required

Not required for current scale.

---

# 20. Final Architecture Summary

```
                 Client

          HTTP        WebSocket

            |            |

        Express      Socket.IO

            |            |

        PostgreSQL     Rooms

            |

        Notifications


            |

          Redis

   Presence + Socket State

```

The system follows:

* Database for truth
* Redis for fast temporary state
* Socket.IO for real-time communication
* Notifications for offline events
* Sync APIs for missed data

export const SOCKET_EVENTS = {
    JOIN_CONVERSATION: "join_conversation",
    LEAVE_CONVERSATION: "leave_conversation",

    SEND_MESSAGE: "send_message",
    NEW_MESSAGE: "new_message",

    MESSAGE_DELIVERED: "message_delivered",
    MESSAGE_READ: "message_read",

    CONVERSATION_READ: "conversation_read",

    TYPING_START: "typing_start",
    TYPING_STOP: "typing_stop",

    USER_ONLINE: "user_online",
    USER_OFFLINE: "user_offline",

    MESSAGE_EDITED:"message_edited",
    MESSAGE_DELETED:"message_deleted",

    GROUP_MEMBER_ADDED:"group_member_added",
    GROUP_MEMBER_REMOVED:"group_member_removed",
    GROUP_MEMBER_LEFT:"group_member_left",
    GROUP_ROLE_UPDATED:"group_role_updated",
    NEW_GROUP: "new_group",
    REMOVED_FROM_GROUP: "removed_from_group"
} as const;
import { increamentUnreadMessage,  setMessages } from "@/store/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useRTM = ({ selectedUser }) => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { messages } = useSelector(store => store.chat);

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));

            // If the message is not from the currently selected user, increase unread count
            if (selectedUser?._id !== newMessage.senderId) {
                dispatch(increamentUnreadMessage());
            }
        };

        socket?.on('newMessage', handleNewMessage);

        // Cleanup function to avoid duplicate listeners
        return () => {
            socket?.off('newMessage', handleNewMessage);
        };

    }, [socket, messages, selectedUser, dispatch]); // Correct dependencies

    return null; // Hooks don't return JSX
};

export default useRTM;

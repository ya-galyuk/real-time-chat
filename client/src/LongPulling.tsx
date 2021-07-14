import React, {useEffect, useState} from 'react';
import axios from "axios";

interface IMessage {
    id: string,
    message: string
}

const LongPulling = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [value, setValue] = useState<string>('')

    const API_URL = 'http://localhost:5000'

    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        try {
            const {data} = await axios.get(`${API_URL}/get-messages`)
            setMessages(prevState => [...prevState, data])
            await subscribe()
        } catch (e) {
            setTimeout(() => {
                subscribe()
            }, 500)
        }
    }

    const sendMessage = async () => {
        try {
            await axios.post(`${API_URL}/new-message`, {
                message: value,
                id: Date.now()
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="center">
            <div className="messages">
                {messages.map(mess =>
                    <div className="messages__mess" key={mess.id}>
                        {mess.message}
                    </div>
                )}
            </div>
            <div className="form">
                <input className="form__input" value={value} onChange={e => setValue(e.target.value)} type="text"/>
                <button className="form__btn" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default LongPulling;

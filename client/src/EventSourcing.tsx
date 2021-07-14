import React, {useEffect, useState} from 'react';
import axios from "axios";

interface IMessage {
    id: string,
    message: string
}

const EventSourcing = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [value, setValue] = useState<string>('')

    const API_URL = 'http://localhost:5000'

    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        const eventSourcing = new EventSource(`${API_URL}/connect`)
        eventSourcing.onmessage = function (event){
            const message = JSON.parse(event.data)
            setMessages(prevState => [...prevState, message])
        }
    }

    const sendMessage = async () => {
        try {
            await axios.post(`${ API_URL}/new-message`, {
                message: value,
                id: Date.now()
            })
            console.log('message is send')
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

export default EventSourcing;

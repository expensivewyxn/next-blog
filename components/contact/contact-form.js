import { useEffect, useState } from "react"
import Animate from "../animations/animate"
import Notification from "../ui/notification"
import classes from "./contact-form.module.css"

export default function ContactForm() {
    const [enteredEmail, setEnteredEmail] = useState('')
    const [enteredName, setEnteredName] = useState('')
    const [enteredMessage, setEnteredMessage] = useState('')
    const [requestStatus, setRequestStatus] = useState()
    const [requestError, setRequestError] = useState()

    useEffect(() => {
        if (requestStatus === 'success' || requestStatus === 'error') {
            const timer = setTimeout(() => {
                setRequestStatus(null)
                setRequestError(null)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [requestStatus])

    async function sendMessageHandler(event) {
        event.preventDefault()
        setRequestStatus('pending')

        let response
        try {
            response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    name: enteredName,
                    message: enteredMessage
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setRequestStatus('success')
            setEnteredEmail('')
            setEnteredName('')
            setEnteredMessage('')
        } catch (error) {
            setRequestError(error.message)
            setRequestStatus('error')
        }


        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong.')
        }
    }

    let notification

    if (requestStatus === 'pending') {
        notification = {
            status: 'pending',
            title: 'Sending message...',
            message: 'Your message is on its way'
        }
    }

    if (requestStatus === 'success') {
        notification = {
            status: 'success',
            title: 'Success',
            message: 'Your message was sent successfully'
        }
    }

    if (requestStatus === 'error') {
        notification = {
            status: 'error',
            title: 'Failed',
            message: requestError
        }
    }

    return (
        <Animate>
            <section className={classes.contact}>
                <h1>How can I help you?</h1>
                <form className={classes.form} onSubmit={sendMessageHandler}>
                    <div className={classes.controls}>
                        <div className={classes.control}>
                            <label htmlFor="email">Your Email</label>
                            <input type='email' id='email' required value={enteredEmail} onChange={event => setEnteredEmail(event.target.value)}></input>
                        </div>
                        <div className={classes.control}>
                            <label htmlFor="name">Your Name</label>
                            <input type='text' id='name' autoComplete="off" required value={enteredName} onChange={event => setEnteredName(event.target.value)}></input>
                        </div>
                    </div>
                    <div className={classes.control}>
                        <label htmlFor="message" >Your Message</label>
                        <textarea rows='5' value={enteredMessage} onChange={event => setEnteredMessage(event.target.value)}></textarea>
                    </div>
                    <div className={classes.actions}>
                        <button>
                            Send Message
                        </button>
                    </div>
                </form>
                {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
            </section>
        </Animate>
    )
}
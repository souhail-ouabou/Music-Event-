import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Event.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useRouter} from 'next/router'

export default function EventPage({ evt }) {
    const router = useRouter()
    const deleteEvent = async(e) => {
        if(confirm('Are you sure?')){
            const res = await fetch(`${API_URL}/api/events/${evt.id}`, {method: 'DELETE'})
         
            const data = await res.json()

            if(!res.ok){
                toast.error(data.message)
            }else {
                router.push('/events')
            }
        }
        


    }
    return (
        <Layout>
            <div className={styles.event}>
                <div className={styles.controls}>
                    <Link href={`/events/edit/${evt.attributes.id}`}>
                        <a>
                            <FaPencilAlt /> Edit Event
                        </a>
                    </Link>
                    <a href="#" className={styles.delete} onClick={deleteEvent}>
                        <FaTimes /> Delete Event
                    </a>
                </div>

                <span>
                    {new Date(evt.attributes.date).toLocaleDateString('en-US')}{' '}
                    at {evt.attributes.time}
                </span>
                <h1>{evt.attributes.name}</h1>
                <ToastContainer/>
                {evt.attributes.image.data && (
                    <div className={styles.image}>
                        <Image
                            src={
                                evt.attributes.image.data.attributes.formats
                                    .large.url
                            }
                            width={960}
                            height={600}
                            alt="img"
                        />
                    </div>
                )}

                <h3>Performes:</h3>
                <p>{evt.attributes.performers}</p>
                <h3>Description:</h3>
                <p>{evt.attributes.description}</p>
                <h3>Venu: {evt.attributes.venue}</h3>
                <p>{evt.attributes.address}</p>
                <Link href={'/events'}>
                    <a className={styles.back}>{'<'} Go Back</a>
                </Link>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    const res = await fetch(`${API_URL}/api/events?populate=*`)
    const events = await res.json()
    const paths = events.data.map((evt) => ({
        params: { slug: evt.attributes.slug },
    }))

    return {
        paths,
        fallback: true,
    }
}

export async function getStaticProps({ params: { slug } }) {
    const res = await fetch(
        `${API_URL}/api/events?populate=*&filters[slug][$eq]=${slug}`
    )
    const events = await res.json() //array of events contain one event

    return {
        props: { evt: events.data[0] },
        revalidate: 1,
    }
}

// export async function getServerSideProps({ query: { slug } }) {
//     const res = await fetch(`${API_URL}/api/events/${slug}`)
//     const events = await res.json() //array of events contain one event

//     return {
//         props: { evt: events[0] },
//     }
// }

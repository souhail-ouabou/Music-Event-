import EventItem from '@/components/EventItem'
import Layout from '@/components/Layout'
import Link from 'next/link'
export default function HomePage({ events }) {
    // console.log(events)

    return (
        <Layout>
            <h1>Upcoming Events</h1>
            {events.data === 0 && <h3>No events to show</h3>}
            {events.data.map((evt) => (
                <EventItem key={evt.attributes.id} evt={evt} />
            ))}
            {events.data.length > 0 && (
                <Link href="/events">
                    <a className="btn-secondary">View All Events</a>
                </Link>
            )}
        </Layout>
    )
}
export async function getStaticProps() {
    const res = await fetch(
        `${API_URL}/api/events?populate=*&_sort=date:ASC&_limit=3`
    )
    const events = await res.json()
    return {
        props: { events },
        revalidate: 1,
    }
}

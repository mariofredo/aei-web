import Image from 'next/image';
import Link from 'next/link';
import '../../styles/cardEvent.scss';

export default function CardEvent({events}) {
  return (
    <>
      {events.map((event, index) => (
        <div className="card_event" key={index}>
          <div className="card_image">
            <Link href={`/event/${event.slug}`}>
              <Image
                src={event.imageCover}
                alt={event.title}
                width={270}
                height={185}
              />
            </Link>
            {event.type === 'paid' ? (
              <div className="card_flag">{event.type}</div>
            ) : (
              <div className="card_flag free">{event.type}</div>
            )}
          </div>
          <div className="card_info">
            <div className="event_title">
              <Link href={`/event/${event.slug}`}>{event.title}</Link>
            </div>
            <div className="event_location">{event.location}</div>
            <div className="event_date">{event.startDate}</div>
            <div className="event_time">{event.startTime}</div>
          </div>
          <div className="card_btn">
            {event.paidStatus === 'paid' ? (
              <Link
                className="blue_btn"
                href={`/event/${event.slug}?q=download_ticket`}
              >
                <span>Download Ticket</span>
              </Link>
            ) : event.paidStatus === 'payment_in_review' ? (
              <Link className="orange_btn" href={`/event/${event.slug}`}>
                <span>Waiting Confirmation</span>
              </Link>
            ) : (
              <Link className="green_btn" href={`/event/${event.slug}`}>
                Join Seminar
              </Link>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

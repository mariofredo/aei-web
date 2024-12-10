'use client';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation'; // Untuk navigasi
import Image from 'next/image';
import Cookies from 'js-cookie';
import {formatDate} from '@/utils';
import '@/styles/eventDetail.scss';

export default function EventDetail({params}) {
  const {slug} = params;
  const [event, setEvent] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeEventTab, setActiveEventTab] = useState('description');
  const handleTabEventClick = (tab) => {
    setActiveEventTab(tab);
  };
  const router = useRouter();

  const fetchEventData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/event/${slug}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
      const data = await response.json();
      setData(data.data);
      setEvent(data.data.event); // Asumsi event ada di `data.data`
    } catch (err) {
      console.error('Error fetching event data:', err);
      setError('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [slug]);

  if (loading) {
    return <div className="loader center"></div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div className="section_event_detail">
      <div className="event_banner">
        <Image
          src={event.imageCover || '/default-image.jpg'}
          alt={event.title || ''}
          width={800}
          height={400}
        />
      </div>
      <div className="container">
        <div className="sed_top">
          <div className="sedt_left">
            <div className="sedt_img">
              <Image
                src={event.image}
                width={240}
                height={240}
                alt={event.title}
              />
            </div>
            <div className="sedt_info">
              <h3>{event.title}</h3>
              <p>Organized by: {event.eventPromotor}</p>
            </div>
          </div>
          <div className="sedt_right">
            <div className="sedt_info">
              <h5>Open Registration until</h5>
              <span>{formatDate(event.scheduleStart)}</span>
              <h5>Remaining Quota</h5>
              <span>{data.remainingQuota} participants</span>
            </div>
          </div>
        </div>
        <div className="sed_mid">
          <div
            className="green_btn"
            onClick={() => router.push(`/event/payment?slug=${slug}`)}
          >
            Join Seminar
          </div>
        </div>
        <div className="sed_bottom">
          <div className="sedb_button">
            <div
              className={activeEventTab === 'description' ? 'active' : ''}
              onClick={() => handleTabEventClick('description')}
            >
              Description
            </div>
            <div
              className={activeEventTab === 'certification' ? 'active' : ''}
              onClick={() => handleTabEventClick('certification')}
            >
              Certification
            </div>
          </div>
          <div className="sedb_ctr">
            {activeEventTab === 'description' && (
              <div className="desc_box">
                <div className="desc_left">
                  <p>{event.description}</p>
                </div>
                <div className="desc_right">
                  <div className="dr_box">
                    <h4>Schedule</h4>
                    <table>
                      <tr>
                        <td>Start</td>
                        <td>:</td>
                        <td>{formatDate(event.scheduleStart)}</td>
                      </tr>
                      <tr>
                        <td>End</td>
                        <td>:</td>
                        <td>{formatDate(event.scheduleEnd)}</td>
                      </tr>
                    </table>
                  </div>
                  <div className="dr_box">
                    <h4 className="location">Location</h4>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>
            )}
            {activeEventTab === 'certification' && <p>{event.certification}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

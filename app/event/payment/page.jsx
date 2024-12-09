'use client';
import React, {useState} from 'react';
import {FiPlusCircle} from 'react-icons/fi';
import '@/styles/eventPayment.scss';

export default function Page() {
  const [participants, setParticipants] = useState([
    {type: '', name: '', position: '', mobile: '', email: '', pic: ''},
  ]);

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      {type: '', name: '', position: '', mobile: '', email: '', pic: ''},
    ]);
  };

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = participants.map((participant, idx) =>
      idx === index ? {...participant, [field]: value} : participant
    );
    setParticipants(updatedParticipants);
  };

  const picOptions = ['John Doe', 'Jane Smith', 'Michael Johnson']; // Example PIC options
  const positionOptions = ['Manager', 'Developer', 'Designer', 'Intern']; // Example position options

  return (
    <div className="ep_ctr">
      <div className="ep_content">
        <div className="ep_box">
          <p className="ep_title">Please Fill Participant</p>
          <div className="ep_participants">
            {participants.map((participant, index) => (
              <div key={index} className="participant">
                <p className='participant_'>Participant {index + 1}</p>
                <div className="participant-type">
                  <label>
                    <input
                      type="radio"
                      name={`type-${index}`}
                      value="PIC"
                      checked={participant.type === 'PIC'}
                      onChange={() =>
                        handleParticipantChange(index, 'type', 'PIC')
                      }
                    />
                    PIC
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`type-${index}`}
                      value="Others"
                      checked={participant.type === 'Others'}
                      onChange={() =>
                        handleParticipantChange(index, 'type', 'Others')
                      }
                    />
                    Others
                  </label>
                </div>

                {participant.type === 'PIC' && (
                  <div className="pic-select">
                    <label htmlFor={`pic-${index}`}>Select PIC:</label>
                    <select
                      id={`pic-${index}`}
                      value={participant.pic}
                      onChange={(e) =>
                        handleParticipantChange(index, 'pic', e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select PIC
                      </option>
                      {picOptions.map((pic, idx) => (
                        <option key={idx} value={pic}>
                          {pic}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {participant.type === 'Others' && (
                  <div className="others-details">
                    <div>
                      <label htmlFor={`name-${index}`}>Name:</label>
                      <input
                        type="text"
                        id={`name-${index}`}
                        value={participant.name}
                        onChange={(e) =>
                          handleParticipantChange(index, 'name', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`position-${index}`}>Position:</label>
                      <select
                        id={`position-${index}`}
                        value={participant.position}
                        onChange={(e) =>
                          handleParticipantChange(
                            index,
                            'position',
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled>
                          Select Position
                        </option>
                        {positionOptions.map((position, idx) => (
                          <option key={idx} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`mobile-${index}`}>Mobile Number:</label>
                      <input
                        type="text"
                        id={`mobile-${index}`}
                        value={participant.mobile}
                        onChange={(e) =>
                          handleParticipantChange(
                            index,
                            'mobile',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`email-${index}`}>Email:</label>
                      <input
                        type="email"
                        id={`email-${index}`}
                        value={participant.email}
                        onChange={(e) =>
                          handleParticipantChange(
                            index,
                            'email',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div onClick={handleAddParticipant} className="add_participant_btn">
            Add Participant
            <FiPlusCircle color="#009B4C" />
          </div>
        </div>
      </div>
    </div>
  );
}

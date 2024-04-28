import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './RoomBooking.css';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const RoomBooking = () => {
  const [rooms, setRooms] = useState([]);
  const [userId, setuserId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeSlots, setTimeSlots] = useState({
    "09:00 AM - 10:00 AM": { isDisable: false, isSelf: false },
    "10:00 AM - 11:00 AM": { isDisable: false, isSelf: false },
    "11:00 AM - 12:00 PM": { isDisable: false, isSelf: false },
    "03:00 PM - 04:00 PM": { isDisable: false, isSelf: false },
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/rooms');
        setRooms(response.data.rooms);
        setuserId(response.data.userId);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleBookingslots = async (date) => {
    const response = await axios.get('/api/rooms/booking', {
      headers: {
        'bookingdate': moment(date).format('YYYY-MM-DD'),
        'roomid': selectedRoom
      }
    });

    if (response.data) {
      const updatedTimeSlots = { ...timeSlots };
      for (const slot of Object.keys(updatedTimeSlots)) {
        const isBooked = response.data.some((r) => slot === r.timeSlot);
        const isSelf = response.data.some((r) => r.userId === userId && slot === r.timeSlot);
        updatedTimeSlots[slot].isDisable = isBooked;
        updatedTimeSlots[slot].isSelf = isSelf;
      }
      setTimeSlots(updatedTimeSlots);
    }
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    setSelectedTimeSlot(null);
    setSelectedDate(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    handleBookingslots(date);
    setSelectedTimeSlot(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBooking = async () => {
    if (selectedRoom !== null && selectedTimeSlot !== null) {
      try {
        const response = await axios.post('/api/rooms/booking', {
          "roomId": selectedRoom,
          "bookingDate": moment(selectedDate).format('YYYY-MM-DD'),
          "timeSlot": selectedTimeSlot,
        });
        if(response){
          
        }
        handleBookingslots(selectedDate);
        setSelectedTimeSlot(null);
        alert(`Room ${selectedRoom} booked for ${selectedTimeSlot} on ${selectedDate}`);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    } else {
      alert('Please select both room, date, and time slot.');
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="room-booking-container">
      <h2>Room Booking</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="booking-grid">
        <div className="room-selection">
          <h3>Select a Room:</h3>
          <ul>
            {filteredRooms.map((room) => (
              <li
                key={room._id}
                className={selectedRoom === room._id ? 'selected animated' : 'animated'}
                onClick={() => handleRoomSelect(room._id)}
              >
                {room.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="calendar-time-slot-container">
          {selectedRoom && (
            <div className="calendar-time-slot">
              <div className="calendar-container">
                <h3>Select a Date:</h3>
                <Calendar
                  onChange={handleDateSelect}
                  value={selectedDate}
                  minDate={new Date()}
                />
              </div>
              {selectedDate && (
                <>
                  <h3>Select a Time Slot:</h3>
                <div className="time-slot-selection">
                  {Object.keys(timeSlots).map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`${selectedTimeSlot === slot ? 'selected' : '' } ${(timeSlots[slot].isDisable && !timeSlots[slot].isSelf)? 'booked-other' : ''} ${timeSlots[slot].isSelf ? 'booked-self' : ''}`}
                      disabled={timeSlots[slot].isDisable}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
            </>
              )}
            </div>
          )}
        </div>
      </div>
      {(selectedRoom && selectedDate && selectedTimeSlot) && (
        <button className="book-button" onClick={handleBooking}>Book Room</button>
      )}
    </div>
  );
};

export default RoomBooking;

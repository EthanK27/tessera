import React, { useState, useEffect } from 'react';
import TesseraSeatPicker from 'tessera-seat-picker';


function SeatPicker({ event_id, user_id }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/inventory/${event_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchData();
  }, [event_id]);

    useEffect(() => {
    if (seats.length > 0) {
      const newRows = Object.values(
        seats.reduce((acc, curr) => {
          const seat_info = {id: curr.row_name + curr.seat_number, number: curr.seat_number, isReserved: curr.status !== 'AVAILABLE', tooltip: String('$' + curr.value)};
          if (!acc[curr.row_name]) {
            acc[curr.row_name] = [seat_info];
          } else {
            acc[curr.row_name].push(seat_info);
          }
          return acc;
        }, {})
      );

      setRows(newRows);
      setLoading(false); 
    }
  }, [seats]);
  console.log({user_id})
  console.log({event_id})


  const addSeatCallback = async ({ row, number, id }, addCb) => {
    console.log({row})
    console.log({number})
    console.log({id})
    
    try {
      setLoading(true)
        // Your custom logic to reserve the seat goes here...
      fetch(`http://localhost:5000/inventory/reserve/${user_id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify (
              {
                  event_id: event_id,
                  row_name: row,
                  seat_number: number
              }
          ),
          credentials: 'include', 
      })
      .then(response => response.json()) 
      .catch(error => console.error('Unable to reserve seat', error));

      // Assuming everything went well...
      setSelected((prevItems) => [...prevItems, id]);
      const updateTooltipValue = 'Added to cart';

      // Important to call this function if the seat was successfully selected - it helps update the screen
      addCb(row, number, id, updateTooltipValue);
    } catch (error) {
      // Handle any errors here
      console.error('Error adding seat:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSeatCallback = async ({ row, number, id }, removeCb) => {
    setLoading(true);

    try {
      // Your custom logic to remove the seat goes here...

      setSelected((list) => list.filter((item) => item !== id));
      removeCb(row, number);
    } catch (error) {
      // Handle any errors here
      console.error('Error removing seat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    //.. A bunch of other stuff...
    <TesseraSeatPicker
      addSeatCallback={addSeatCallback}
      removeSeatCallback={removeSeatCallback}
      rows={rows}
      maxReservableSeats={3}
      alpha
      visible
      loading={loading}
    />
  );
}

export default SeatPicker;


// import React, { useState, useEffect } from 'react';
// import TesseraSeatPicker from 'tessera-seat-picker';

// function SeatPicker({ event_id }) {
//   const [allSeats, setAllSeats] = useState([]);
//   const [rowsMap, setRowsMap] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/inventory/prices/${event_id}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const data = await response.json();
//         setAllSeats(data);
//       } catch (error) {
//         console.error('Error fetching event details:', error);
//       }
//     };

//     fetchData();
//   }, [event_id]);

//   useEffect(() => {
//     if (allSeats.length > 0) {
//       const newRowsMap = Object.values(
//         allSeats.reduce((acc, cur) => {
//           const rowId = cur.row_name;
//           const seatInfo = {
//             id: rowId + cur.seat_number,
//             number: cur.seat_number,
//             isReserved: cur.status !== 'AVAILABLE',
//             tooltip: String('$' + cur.value),
//           };
//           if (!acc[rowId]) {
//             acc[rowId] = [seatInfo];
//           } else {
//             acc[rowId].push(seatInfo);
//           }
//           return acc;
//         }, {})
//       );

//       setRowsMap(newRowsMap);
//       setLoading(false); 
//     }
//   }, [allSeats]);

//   const addSeatCallback = async ({ row, number, id }, addCb) => {
//     // Handle seat addition
//   };

//   const removeSeatCallback = async ({ row, number, id }, removeCb) => {
//     // Handle seat removal
//   };

//   return (
//     <div>
//       {loading ? (
//         <h2>Loading...</h2> 
//       ) : (
//         <TesseraSeatPicker
//           addSeatCallback={addSeatCallback}
//           removeSeatCallback={removeSeatCallback}
//           rows={rowsMap}
//           maxReservableSeats={3}
//           alpha
//           visible
//           loading={loading}
//         />
//       )}
//     </div>
//   );
// }

// export default SeatPicker;

// useEffect(() => {
//     debugger
//     setRowsMap(Object.values(allSeats.reduce((acc, cur) => {
//       const rowId = cur.row_name;
//       const seatInfo = { id: rowId + cur.seat_number, number: cur.seat_number, isReserved: (cur.status == 'AVAILABLE' ? false : true)};
//       if (!acc[rowId]) {
//         acc[rowId] = [seatInfo];
//       } else {
//         acc[rowId].push(seatInfo);
//       }
//       return acc;
//     }, {})));

    
//     setLoading(false);
//   }, [allSeats]);

//Backend
// setTimeout(c) => {
//     ...
// }, 5
// How to run python code every 5 minutes?
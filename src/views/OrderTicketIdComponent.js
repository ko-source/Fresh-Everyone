import { CBadge } from '@coreui/react';
import React, { useState, useEffect } from 'react'

import { useHistory, useLocation } from 'react-router-dom'

import firebase from '../config/fbconfig'

const OrderTicketId = ({...props}) => {

  var [state, setState] = useState({
    ticketId: null,
    paid:0,
    total:0
  });
  const history = useHistory()


  useEffect(() => {
    getticketId();
  }, [])
  const getticketId = () => {
    firebase.firestore().collection('orders').doc(props.orderId).get().then(value => {
      setState({
        ...state,
        ticketId: value.data() ? value.data()["ticketId"] : null,
        paid: value.data() ? value.data()["amountPaid"] : 0,
        total: value.data() ? value.data()["total"] : 0,

      })
    })
  }


  return (

    state.ticketId !== null ?

    <td   onClick={()=>
      history.push(
      `/orders/${props.orderId}`
    )} >




{state.ticketId}
<tr>
Paid:
{state.paid}

</tr>
<tr>
Total:
{state.total}

</tr>

<tr>
{ state.paid<state.total? <CBadge color="danger">                     Pending

                      </CBadge>

                      :   <CBadge color="success">

                        Paid

                        </CBadge>
}</tr>


    </td>
:<td>Loading...</td>
  )
}

export default OrderTicketId

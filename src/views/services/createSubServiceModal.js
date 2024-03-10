import { CModal, CModalHeader, CModalFooter, CAlert, CModalBody, CButton, CForm, CFormGroup, CSpinner, CInput, CLabel } from '@coreui/react'
import React, { useState } from 'react'
import firebase from '../../config/fbconfig'
import { useFormik } from 'formik';

export default function CreateSubServiceModal({ serviceId, show, onClose, onServiceAdded }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState()

  const addService = async (values) => {
    setLoading(true);
    try {
      await firebase.firestore().collection('services').doc(serviceId).collection('subservices').add({
        name: values.sub_service,
        translations: {
          malayalam: values.translations.malayalam
        }
      });

      serviceForm.resetForm();
      onServiceAdded();
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
    setLoading(false);
  }


  const serviceForm = useFormik({
    initialValues: {
      sub_service: '',
      translations: {
        malayalam: ''
      }
    },
    onSubmit: addService
  })



  return (
    <CModal
      show={show}
      onClose={onClose}
    >
      <CModalHeader closeButton><h2>Create Sub Service</h2></CModalHeader>
      <CForm onSubmit={serviceForm.handleSubmit} >
        <CAlert color="success" show={status === 'success'}>
          Sub Service Added
          </CAlert>

        <CModalBody>
          <CFormGroup>

            <CFormGroup>
              <CLabel>Sub Service Name</CLabel>
              <CInput name="sub_service" onChange={serviceForm.handleChange}
                value={serviceForm.values.sub_service} />
            </CFormGroup>

            <CFormGroup>
              <h4 style={{ marginBottom: 10, marginTop: 20 }}>Translation</h4>

              <CFormGroup>
                <CLabel>Malayalam</CLabel>
                <CInput name="translations.malayalam" placeholder="Translations in malayalam" onChange={serviceForm.handleChange}
                  value={serviceForm.values.translations.malayalam} />
              </CFormGroup>

            </CFormGroup>


          </CFormGroup>
        </CModalBody>
        <CModalFooter>
          {/* <CButton color="primary">Do Something</CButton>{' '} */}
          {loading
            ? <CSpinner size="small" color="info" />
            : <CButton type="submit" color="success" disabled={loading} >Add Sub Service</CButton>
          }
          <CButton
            type="button"
            color="secondary"
            onClick={onClose}
          >Cancel</CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

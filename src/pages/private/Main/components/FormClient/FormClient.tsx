import { ClientModelMap, GlobalColors } from '@/models'
import { createNewClientService } from '@/services'
import { formatDNI } from '@/utils'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Text,
  VStack
} from '@chakra-ui/react'
import { Field, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { HiUpload } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import * as Yup from 'yup'

interface FormClientProps {
  socket: Socket
}

const FormClient: React.FC<FormClientProps> = ({ socket }) => {
  const authState = useSelector(
    (state: { user: { id: string; name: string } }) => state.user
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState('')

  const handleClientErrorForm = (message: string) => {
    setFormErrorMessage(message)
    setTimeout(() => {
      setFormErrorMessage('')
    }, 5000)
  }

  const onSubmit = async (
    data: MyFormValues,
    actions: FormikHelpers<MyFormValues>
  ) => {
    setIsSubmitting(true)
    const cleanDNI = formatDNI(data.dni)
    createNewClientService({
      ...data,
      dni: cleanDNI,
      employeeId: authState.id
    })
      .then((res: ClientModelMap) => {
        socket.emit('client:updateListOfClients', res)
      })
      .catch((err) => {
        handleClientErrorForm(err)
      })
    actions.resetForm()
    setIsSubmitting(false)
  }

  interface MyFormValues {
    name: string
    dni: string
  }

  const initialValues: MyFormValues = {
    name: '' as string,
    dni: '' as string
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('NOMBRE OBLIGATORIO'),
    dni: Yup.string()
      .matches(
        /^(?:\d{8}|\d{2}\.\d{3}\.\d{3})?$/,
        'El formato debe ser 12345678 o 12.345.678'
      )
      .notRequired()
  })

  return (
    <>
      {formErrorMessage ? (
        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          m={'0 auto'}
          p={1}
          borderRadius={10}
          bgClip={'text'}
          bgGradient={GlobalColors.WARNINGCOLOR}>
          <Text textAlign={'center'} as='b'>
            {formErrorMessage}
          </Text>
        </Flex>
      ) : (
        ''
      )}
      <Formik
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        initialValues={initialValues}>
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <VStack pb={4}>
              <Flex gap={4}>
                <Flex gap={4} w={'100%'}>
                  <FormControl
                    isInvalid={Boolean(
                      formik.errors.name && formik.touched.name
                    )}>
                    <FormLabel p={0} m={0}>
                      Nombre:
                    </FormLabel>
                    <Field
                      w={'100%'}
                      type='string'
                      name='name'
                      placeholder='Nombre'
                      as={Input}
                    />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={Boolean(
                      formik.errors.dni && formik.touched.dni
                    )}>
                    <FormLabel p={0} m={0}>
                      DNI:
                    </FormLabel>
                    <Field
                      type='string'
                      name='dni'
                      placeholder='DNI'
                      as={Input}
                    />
                    <FormErrorMessage>{formik.errors.dni}</FormErrorMessage>
                  </FormControl>
                </Flex>
                <Flex alignContent={'end'} alignItems={'end'}>
                  <Button
                    type='submit'
                    isLoading={isSubmitting}
                    bgGradient={GlobalColors.SENDMESSAGEBUTTON}
                    _hover={{
                      bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
                    }}
                    p={4}
                    w={'auto'}
                    borderRadius={18}>
                    <Text
                      display={'flex'}
                      gap={1}
                      alignItems={'center'}
                      fontSize={{
                        base: '0.8rem',
                        md: '0.8rem',
                        lg: '0.9rem'
                      }}>
                      Cargar <Icon as={HiUpload} />
                    </Text>
                  </Button>
                </Flex>
              </Flex>
            </VStack>
          </form>
        )}
      </Formik>
    </>
  )
}

export default FormClient

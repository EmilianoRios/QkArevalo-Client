import { GlobalColors } from '@/models'
import { createNewClientService } from '@/services'
import { capitalizeInitials, formatDNI } from '@/utils'
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
    const regex = /^(.*[^\d])?(\d{8})?$/
    const match = data.nameAndDni.match(regex)
    let cleanDNI
    let cleanName

    if (match) {
      const [, name, dni] = match
      cleanDNI = formatDNI(dni)
      cleanName = capitalizeInitials(name)
    }

    createNewClientService({
      name: cleanName,
      dni: cleanDNI,
      employeeId: authState.id
    })
      .then((res) => {
        socket.emit('client:addOneClient', {
          data: res,
          employeeId: res.employee.id
        })
      })
      .catch((err) => {
        handleClientErrorForm(err)
      })
    actions.resetForm()
    setIsSubmitting(false)
  }

  interface MyFormValues {
    nameAndDni: string
  }

  const initialValues: MyFormValues = {
    nameAndDni: '' as string
  }

  const nameAndDniValidation = (value: any): boolean => {
    if (!value) {
      return false
    }
    const regex = /^(.*[^\d])?(\d{8})?$/
    const match = value.match(regex)
    if (!match) {
      return false
    }
    const [, name, dni] = match

    return !!name && (!dni || dni.length === 8)
  }

  const validationSchema = Yup.object().shape({
    nameAndDni: Yup.string().test(
      'nameAndDni',
      'Nombres o DNI no válidos',
      nameAndDniValidation
    )
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
              <Flex gap={4} w={'100%'}>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.nameAndDni && formik.touched.nameAndDni
                  )}>
                  <FormLabel p={0} m={0}>
                    Nombres DNI:
                  </FormLabel>
                  <Field
                    w={'100%'}
                    type='string'
                    name='nameAndDni'
                    placeholder='Nombres o Nombres + DNI'
                    as={Input}
                  />
                  <FormErrorMessage>
                    {formik.errors.nameAndDni}
                  </FormErrorMessage>
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
            </VStack>
          </form>
        )}
      </Formik>
    </>
  )
}

export default FormClient

/* import { FormSinglePage } from '@/components' */
import { GlobalColors } from '@/models'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack
} from '@chakra-ui/react'
import { Field, Formik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'

const CreateClientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>()
  const [logInErrorMessage, setLogInErrorMessage] = useState<string>()

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
    dni: Yup.string().required('DNI OBLIGATORIO')
  })

  const onSubmit = async (data: MyFormValues) => {
    setIsSubmitting(true)
    console.log(data)
  }

  return (
    <VStack>
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
                    formik.errors.name && formik.touched.name
                  )}>
                  <FormLabel>Nombre:</FormLabel>
                  <Field
                    type='string'
                    name='name'
                    placeholder='Nombre'
                    as={Input}
                  />
                  <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(formik.errors.dni && formik.touched.dni)}>
                  <FormLabel>DNI:</FormLabel>
                  <Field
                    type='string'
                    name='dni'
                    placeholder='DNI'
                    as={Input}
                  />
                  <FormErrorMessage>{formik.errors.dni}</FormErrorMessage>
                </FormControl>
                {logInErrorMessage ? (
                  <Box
                    m={'0 auto'}
                    p={1}
                    borderRadius={10}
                    bgClip={'text'}
                    bgGradient={GlobalColors.WARNINGCOLOR}>
                    <Text as='b'>{logInErrorMessage}</Text>
                  </Box>
                ) : (
                  ''
                )}
              </Flex>
              <HStack alignContent={'center'} alignItems={'center'}>
                <Button
                  type='submit'
                  isLoading={isSubmitting}
                  bgGradient={GlobalColors.SENDMESSAGEBUTTON}
                  _hover={{
                    bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
                  }}
                  p={6}
                  borderRadius={18}>
                  Cargar
                </Button>
              </HStack>
            </VStack>
          </form>
        )}
      </Formik>
    </VStack>
  )
}

export default CreateClientForm

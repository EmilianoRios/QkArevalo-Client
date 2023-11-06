import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'

import { Link as ReactLink } from 'react-router-dom'
import { GlobalColors, PrivateRoutes } from '@/models'

const NotFound = () => {
  return (
    <Flex
      alignContent={'center'}
      justifyContent={'center'}
      alignItems={'center'}
      w={'100%'}
      h={'100vh'}
      flexDirection={'column'}>
      <Box bgClip={'text'} bgGradient={GlobalColors.TEXTBLUEGRADIENT}>
        <Text fontSize={{ base: '10rem', lg: '20rem' }}>404</Text>
      </Box>
      <Box position={'absolute'} pt={{ base: 40, lg: 80 }}>
        <Text
          fontSize={{
            base: '0.8rem',
            sm: '2rem',
            md: '3rem',
            lg: '4rem'
          }}>
          Página no encontrada.
        </Text>
      </Box>
      <Link
        as={ReactLink}
        to={`/${PrivateRoutes.PRIVATE}`}
        pt={{ base: 10, lg: 0 }}>
        <Button
          bgGradient={GlobalColors.SENDMESSAGEBUTTON}
          _hover={{
            bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
          }}>
          Volver al Inicio
        </Button>
      </Link>
    </Flex>
  )
}

export default NotFound

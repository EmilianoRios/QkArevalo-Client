import { GlobalColors, PrivateRoutes } from '@/models'
import { Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { FaFileDownload } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CreatePdf } from '..'

function DowloadPDF() {
  const authState = useSelector(
    (state: { user: { id: string; name: string; role: string } }) => state.user
  )

  const navigate = useNavigate()

  return (
    <Flex
      flexDirection={'column'}
      justifyContent={'center'}
      justifyItems={'center'}
      alignContent={'center'}
      alignItems={'center'}
      h={'100vh'}
      m={'0 auto'}>
      <Flex
        display={'column'}
        bg={GlobalColors.BGCONTENT}
        border='1px solid'
        rounded={20}
        borderColor={GlobalColors.BORDERCONTENT}
        w={{ base: '80%', md: '80%', lg: '10%' }}
        maxW={{ base: '400px', lg: '400px' }}
        minW={{ lg: '400px' }}>
        <Flex justifyContent={'space-between'}>
          <Heading
            as='h3'
            id='principalTitle'
            p={4}
            fontSize={{
              base: '1.2rem',
              sm: '1.2rem',
              md: '1.2rem',
              lg: '1.3rem'
            }}>
            Descargar
          </Heading>
          <Button
            h={'60px'}
            borderRadius={'0px 18px 0px 18px'}
            bg={GlobalColors.BORDERCONTENT}
            _hover={{
              bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
            }}
            onClick={() => {
              navigate(`/${PrivateRoutes.PRIVATE}`)
            }}>
            Volver
          </Button>
        </Flex>
        <Flex
          w={'100%'}
          p={2}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
          gap={2}>
          <PDFDownloadLink
            document={<CreatePdf isMyClients={false} idUser={authState.id} />}
            fileName={`Clientes-${Date.now()}.pdf`}>
            {({ loading }) =>
              loading ? (
                <button>Loading Document...</button>
              ) : (
                <Button w={'100%'}>
                  <Text
                    display={'flex'}
                    alignItems={'center'}
                    gap={1}
                    transition={'0.1s'}>
                    Descargar Clientes
                    <Icon as={FaFileDownload} />
                  </Text>
                </Button>
              )
            }
          </PDFDownloadLink>
          <PDFDownloadLink
            document={<CreatePdf isMyClients={true} idUser={authState.id} />}
            fileName={`MisClientes-${Date.now()}.pdf`}>
            {({ loading }) =>
              loading ? (
                <button>Loading Document...</button>
              ) : (
                <Button w={'100%'}>
                  <Text
                    display={'flex'}
                    alignItems={'center'}
                    gap={1}
                    transition={'0.1s'}>
                    Descargar Mis Clientes
                    <Icon as={FaFileDownload} />
                  </Text>
                </Button>
              )
            }
          </PDFDownloadLink>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default DowloadPDF

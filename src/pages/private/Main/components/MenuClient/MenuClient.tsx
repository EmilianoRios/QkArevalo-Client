import { ClientModelMap, GlobalColors, StatusClient } from '@/models'
import { updateOneClientService } from '@/services'
import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsFillTrashFill } from 'react-icons/bs'
import { Socket } from 'socket.io-client'

interface MenuClientProps {
  onOpenDeleteDialog: () => void
  client: ClientModelMap
  setClientToDelete: React.Dispatch<React.SetStateAction<ClientModelMap>>
  openOptions: string
  setOpenOptions: React.Dispatch<React.SetStateAction<string>>
  socket: Socket
}

const MenuClient: React.FC<MenuClientProps> = ({
  onOpenDeleteDialog,
  client,
  setClientToDelete,
  openOptions,
  setOpenOptions,
  socket
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const updateOneClient = (clientId: string, status: string) => {
    setIsLoading(true)
    updateOneClientService({ clientId, status }).then((res) => {
      socket.emit('client:updateListOfClients', {
        data: [res],
        employeeId: res.employee.id
      })
      setIsLoading(false)
      setOpenOptions('none')
    })
  }

  const deleteOneClient = (clientData: ClientModelMap) => {
    setClientToDelete(clientData)
    onOpenDeleteDialog()
    setOpenOptions('none')
  }

  return (
    <>
      <Flex
        flexDirection={'column'}
        p={2}
        w={'100%'}
        display={openOptions}
        gap={2}
        bgGradient={`linear-gradient(90deg, ${GlobalColors.BGGRADIENTPRIMARY}, ${GlobalColors.BGRADIENTDEFAULT} )`}>
        <Button
          w={'100%'}
          isLoading={isLoading}
          size={'sm'}
          borderRadius={4}
          bg={GlobalColors.BGRADIENTPAID}
          onClick={() => {
            updateOneClient(client.id, StatusClient.PAID)
          }}
          bgGradient={`linear-gradient(90deg, ${GlobalColors.BGGRADIENTPRIMARY}, ${GlobalColors.BGRADIENTPAID} )`}>
          <Text textShadow={'2px 2px 3px rgba(0, 0, 0, 0.9)'}>Pagado</Text>
        </Button>
        <Button
          w={'100%'}
          isLoading={isLoading}
          size={'sm'}
          borderRadius={4}
          bg={GlobalColors.BGRADIENTPENDING}
          onClick={() => {
            updateOneClient(client.id, StatusClient.PENDING)
          }}
          bgGradient={`linear-gradient(90deg, ${GlobalColors.BGGRADIENTPRIMARY}, ${GlobalColors.BGRADIENTPENDING} )`}>
          <Text textShadow={'2px 2px 3px rgba(0, 0, 0, 0.9)'}>Pendiente</Text>
        </Button>

        <Button
          w={'100%'}
          isLoading={isLoading}
          size={'sm'}
          borderRadius={4}
          bg={GlobalColors.BGRADIENTCANCELLED}
          onClick={() => {
            updateOneClient(client.id, StatusClient.CANCELLED)
          }}
          bgGradient={`linear-gradient(90deg, ${GlobalColors.BGGRADIENTPRIMARY}, ${GlobalColors.BGRADIENTCANCELLED} )`}>
          <Text textShadow={'2px 2px 3px rgba(0, 0, 0, 0.9)'}>Cancelado</Text>
        </Button>

        <Button
          w={'100%'}
          isLoading={isLoading}
          size={'sm'}
          borderRadius={4}
          bg={GlobalColors.BGRADIENTDEFAULT}
          onClick={() => {
            updateOneClient(client.id, StatusClient.DEFAULT)
          }}
          bgGradient={`linear-gradient(90deg, ${GlobalColors.BGGRADIENTPRIMARY}, ${GlobalColors.BGRADIENTDEFAULTBUTTON} )`}>
          <Text textShadow={'2px 2px 3px rgba(0, 0, 0, 0.9)'}>Por Defecto</Text>
        </Button>
        <Box pb={2}>Zona de Riesgo</Box>
        <Button
          isLoading={isLoading}
          size={'sm'}
          w={'100%'}
          borderRadius={4}
          bgGradient={GlobalColors.WARNINGCOLOR}
          onClick={() => {
            deleteOneClient(client)
          }}>
          <Text
            display={'flex'}
            gap={1}
            alignItems={'center'}
            textShadow={'2px 2px 3px rgba(0, 0, 0, 0.9)'}>
            Eliminar <Icon as={BsFillTrashFill} />
          </Text>
        </Button>
      </Flex>
    </>
  )
}

export default MenuClient

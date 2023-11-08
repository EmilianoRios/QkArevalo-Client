import { ClientModelMap, GlobalColors, StatusClient } from '@/models'
import { updateOneClientService } from '@/services'
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { BsFillTrashFill } from 'react-icons/bs'
import { CiMenuKebab } from 'react-icons/ci'
import { Socket } from 'socket.io-client'

interface MenuClientProps {
  onOpenDeleteDialog: () => void
  client: ClientModelMap
  setClientToDelete: React.Dispatch<React.SetStateAction<ClientModelMap>>
  socket: Socket
}

const MenuClient: React.FC<MenuClientProps> = ({
  onOpenDeleteDialog,
  client,
  setClientToDelete,
  socket
}) => {
  const firstFieldRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const { onOpen, onClose, isOpen } = useDisclosure()

  const updateOneClient = (clientId: string, status: string) => {
    setIsLoading(true)
    updateOneClientService({ clientId, status }).then((res) => {
      socket.emit('client:updateListOfClients', res)
      setIsLoading(false)
      onClose()
    })
  }

  const deleteOneClient = () => {
    setClientToDelete(client)
    onOpenDeleteDialog()
  }

  return (
    <>
      <Popover
        placement={'bottom-end'}
        closeOnBlur={true}
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        flip>
        <PopoverTrigger>
          <Button
            as={IconButton}
            icon={<CiMenuKebab />}
            aria-label='Options-Client'
            variant='outline'
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg={GlobalColors.BORDERCONTENT}>
            <PopoverArrow bg={GlobalColors.BORDERCONTENT} />
            <PopoverHeader>Opciones</PopoverHeader>
            <PopoverBody>
              <Flex flexDirection={'column'} gap={2}>
                <Button
                  isLoading={isLoading}
                  size={'sm'}
                  borderRadius={4}
                  bg={GlobalColors.BGRADIENTPAID}
                  onClick={() => {
                    updateOneClient(client.id, StatusClient.PAID)
                  }}>
                  Pagado
                </Button>
                <Button
                  isLoading={isLoading}
                  size={'sm'}
                  borderRadius={4}
                  bg={GlobalColors.BGRADIENTPENDING}
                  onClick={() => {
                    updateOneClient(client.id, StatusClient.PENDING)
                  }}>
                  Pendiente
                </Button>
                <Button
                  isLoading={isLoading}
                  size={'sm'}
                  borderRadius={4}
                  bg={GlobalColors.BGRADIENTCANCELLED}
                  onClick={() => {
                    updateOneClient(client.id, StatusClient.CANCELLED)
                  }}>
                  Cancelado
                </Button>
                <Button
                  isLoading={isLoading}
                  size={'sm'}
                  borderRadius={4}
                  bg={GlobalColors.BGRADIENTDEFAULT}
                  onClick={() => {
                    updateOneClient(client.id, StatusClient.DEFAULT)
                  }}>
                  Por Defecto
                </Button>
              </Flex>
            </PopoverBody>
            <PopoverFooter w={'100%'}>
              <Box pb={2}>Zona de Riesgo</Box>
              <Flex>
                <Button
                  isLoading={isLoading}
                  size={'sm'}
                  w={'100%'}
                  borderRadius={4}
                  bgGradient={GlobalColors.WARNINGCOLOR}
                  onClick={() => {
                    deleteOneClient()
                  }}>
                  <Text display={'flex'} gap={1} alignItems={'center'}>
                    Eliminar <Icon as={BsFillTrashFill} />
                  </Text>
                </Button>
              </Flex>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  )
}

export default MenuClient

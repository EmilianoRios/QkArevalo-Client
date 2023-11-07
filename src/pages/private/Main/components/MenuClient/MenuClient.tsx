import { ClientModelMap, GlobalColors, StatusClient } from '@/models'
import { updateOneClientService } from '@/services'
import {
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Text
} from '@chakra-ui/react'
import React from 'react'
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
  const updateOneClient = (clientId: string, status: string) => {
    updateOneClientService({ clientId, status }).then((res) => {
      socket.emit('client:updateListOfClients', res)
    })
  }

  const deleteOneClient = () => {
    setClientToDelete(client)
    onOpenDeleteDialog()
  }

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<CiMenuKebab />}
          aria-label='Options'
          variant='outline'
        />
        <MenuList bg={GlobalColors.BORDERCONTENT} gap={4}>
          <MenuOptionGroup title='Estados'>
            <Flex flexDirection={'column'} gap={2} m={2}>
              <MenuItem
                borderRadius={4}
                bg={GlobalColors.BGRADIENTPAID}
                onClick={() => {
                  updateOneClient(client.id, StatusClient.PAID)
                }}>
                Pagado
              </MenuItem>
              <MenuItem
                borderRadius={4}
                bg={GlobalColors.BGRADIENTPENDING}
                onClick={() => {
                  updateOneClient(client.id, StatusClient.PENDING)
                }}>
                Pendiente
              </MenuItem>
              <MenuItem
                borderRadius={4}
                bg={GlobalColors.BGRADIENTCANCELLED}
                onClick={() => {
                  updateOneClient(client.id, StatusClient.CANCELLED)
                }}>
                Cancelado
              </MenuItem>
              <MenuItem
                borderRadius={4}
                bg={GlobalColors.BGRADIENTDEFAULT}
                onClick={() => {
                  updateOneClient(client.id, 'DEFAULT')
                }}>
                Por Defecto
              </MenuItem>
            </Flex>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuOptionGroup title='Zona de Riesgo'>
            <Flex m={2}>
              <MenuItem
                borderRadius={4}
                bgGradient={GlobalColors.WARNINGCOLOR}
                onClick={() => {
                  deleteOneClient()
                }}>
                <Text display={'flex'} gap={1} alignItems={'center'}>
                  Eliminar <Icon as={BsFillTrashFill} />
                </Text>
              </MenuItem>
            </Flex>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </>
  )
}

export default MenuClient

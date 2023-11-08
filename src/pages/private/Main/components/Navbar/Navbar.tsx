/* import { LogOut } from '@/components' */
import { LogOut } from '@/components'
import { GlobalColors, PrivateRoutes, StatusClient } from '@/models'
import { updateAllStatusClientsForEmployeeService } from '@/services'

import {
  Flex,
  Heading,
  Icon,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { BiMenu } from 'react-icons/bi'
import { BsFillTrashFill } from 'react-icons/bs'
import { IoReload } from 'react-icons/io5'
import { TiUserAdd } from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface NavbarPrivateProps {
  title: string
  fetchClients: () => void
  onOpenDeleteManyDialog: () => void
}

const NavbarPrivate: React.FC<NavbarPrivateProps> = ({
  title,
  fetchClients,
  onOpenDeleteManyDialog
}) => {
  const authState = useSelector(
    (state: { user: { id: string; name: string; role: string } }) => state.user
  )

  const navigate = useNavigate()

  const handleSetDefaultStates = () => {
    updateAllStatusClientsForEmployeeService({
      employeeId: authState.id,
      status: StatusClient.DEFAULT
    }).then(() => {
      fetchClients()
      /* socket.emit('client:resetStatusMyClients', res) */
    })
  }

  return (
    <Flex
      justifyContent='space-between'
      w='100%'
      transition='0.2s'
      bg={GlobalColors.BGCONTENT}
      position={'relative'}
      borderTop={'1px solid'}
      borderColor={GlobalColors.BORDERCONTENT}
      zIndex={50000}>
      <Flex justifyContent={'center'} alignItems={'center'}>
        <Flex flexDirection={'column'}>
          <Heading
            as='h3'
            id='principalTitle'
            ml={4}
            pt={4}
            fontSize={{
              base: '1.2rem',
              sm: '1.2rem',
              md: '1.2rem',
              lg: '1.3rem'
            }}>
            {title}
          </Heading>
          <Text ml={4}>
            Cuenta de{' '}
            <Text as={'b'} color={GlobalColors.EMPHASIZED}>
              {authState.name}
            </Text>
          </Text>
        </Flex>
      </Flex>
      <Flex
        borderRadius={'0px 20px 0px 20px'}
        p={{ base: 3, sm: 3, md: 3, lg: 4 }}
        bg={'whiteAlpha.100'}
        color={'white'}
        justifyContent='center'
        bottom={0}
        left={0}
        zIndex={1}>
        <List
          display='flex'
          alignItems='center'
          gap={4}
          fontSize={{ base: '0.81rem', sm: '0.85rem', lg: 'unset' }}>
          <ListItem>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<BiMenu />}
                variant='ghost'
              />
              <MenuList bg={GlobalColors.BORDERCONTENT}>
                <MenuOptionGroup title='Menú'>
                  <Flex px={2} flexDirection={'column'} gap={2}>
                    <MenuItem
                      bg={GlobalColors.BGRADIENTDEFAULT}
                      borderRadius={4}
                      onClick={() => {
                        handleSetDefaultStates()
                      }}>
                      <Text
                        display={'flex'}
                        alignItems={'center'}
                        gap={1}
                        _hover={{ color: GlobalColors.EMPHASIZED }}
                        transition={'0.1s'}>
                        Restablecer Estados <Icon as={IoReload} />
                      </Text>
                    </MenuItem>
                    {authState.role === 'ADMIN' && (
                      <MenuItem
                        bg={GlobalColors.BGRADIENTDEFAULT}
                        borderRadius={4}
                        onClick={() => {
                          navigate(
                            `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REGISTER}`
                          )
                        }}>
                        <Text
                          display={'flex'}
                          alignItems={'center'}
                          gap={1}
                          _hover={{ color: GlobalColors.EMPHASIZED }}
                          transition={'0.1s'}>
                          Registrar <Icon as={TiUserAdd} />
                        </Text>
                      </MenuItem>
                    )}
                    <Flex
                      bg={GlobalColors.BGRADIENTDEFAULT}
                      borderRadius={4}
                      py={1}
                      px={3}>
                      <LogOut />
                    </Flex>
                  </Flex>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup title='Zona de Riesgo'>
                  <Flex px={2}>
                    <MenuItem
                      borderRadius={4}
                      transition={'0.2s'}
                      _hover={{
                        bgGradient: GlobalColors.BGWID,
                        transition: '0.2s'
                      }}
                      bgGradient={GlobalColors.WARNINGCOLOR}
                      onClick={() => {
                        onOpenDeleteManyDialog()
                      }}>
                      <Text display={'flex'} gap={1} alignItems={'center'}>
                        Eliminar Mis Clientes
                        <Icon as={BsFillTrashFill} />
                      </Text>
                    </MenuItem>
                  </Flex>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </ListItem>
        </List>
      </Flex>
    </Flex>
  )
}

export default NavbarPrivate

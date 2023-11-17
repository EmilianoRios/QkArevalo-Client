/* import { LogOut } from '@/components' */
import {
  ClientModelMap,
  GlobalColors,
  PrivateRoutes,
  StatusClient
} from '@/models'
import { resetUser } from '@/redux'
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
import { FaFileDownload } from 'react-icons/fa'
import { BsFillTrashFill, BsPeopleFill } from 'react-icons/bs'
import { HiOutlineLogout } from 'react-icons/hi'
import { IoReload } from 'react-icons/io5'
import { TiUserAdd } from 'react-icons/ti'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CreatePdf } from '@/pages'

interface NavbarPrivateProps {
  title: string
  socket: Socket
  onOpenDeleteManyDialog: () => void
  allClients: ClientModelMap[]
  myClients: ClientModelMap[]
}

const NavbarPrivate: React.FC<NavbarPrivateProps> = ({
  title,
  socket,
  onOpenDeleteManyDialog,
  allClients,
  myClients
}) => {
  const authState = useSelector(
    (state: { user: { id: string; name: string; role: string } }) => state.user
  )

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logOut = () => {
    dispatch(resetUser())
    navigate(`/`)
  }

  const handleSetDefaultStates = () => {
    updateAllStatusClientsForEmployeeService({
      employeeId: authState.id,
      status: StatusClient.DEFAULT
    }).then((res) => {
      socket.emit('client:updateListOfClients', {
        data: res,
        employeeId: authState.id
      })
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
      <Flex>
        <List
          gap={4}
          fontSize={{ base: '0.81rem', sm: '0.85rem', lg: 'unset' }}>
          <ListItem>
            <Menu>
              <MenuButton
                h={'60px'}
                w={'60px'}
                borderRadius={'0px 18px 0px 18px'}
                p={{ base: 3, sm: 3, md: 3, lg: 4 }}
                as={IconButton}
                aria-label='Options'
                icon={<BiMenu />}
              />
              <MenuList bg={GlobalColors.BORDERCONTENT}>
                <MenuOptionGroup title='Menú'>
                  <Flex px={2} flexDirection={'column'} gap={2}>
                    <MenuItem
                      bg={GlobalColors.BGRADIENTDEFAULT}
                      _hover={{ color: GlobalColors.EMPHASIZED }}
                      borderRadius={4}
                      onClick={() => {
                        handleSetDefaultStates()
                      }}>
                      <Text
                        display={'flex'}
                        alignItems={'center'}
                        gap={1}
                        transition={'0.1s'}>
                        Restablecer Mis Estados <Icon as={IoReload} />
                      </Text>
                    </MenuItem>
                    {authState.role === 'ADMIN' && (
                      <>
                        <MenuItem
                          bg={GlobalColors.BGRADIENTDEFAULT}
                          _hover={{ color: GlobalColors.EMPHASIZED }}
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
                            transition={'0.1s'}>
                            Registrar <Icon as={TiUserAdd} />
                          </Text>
                        </MenuItem>
                        <MenuItem
                          bg={GlobalColors.BGRADIENTDEFAULT}
                          _hover={{ color: GlobalColors.EMPHASIZED }}
                          borderRadius={4}
                          onClick={() => {
                            navigate(
                              `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LISTOFUSERS}`
                            )
                          }}>
                          <Text
                            display={'flex'}
                            alignItems={'center'}
                            gap={1}
                            transition={'0.1s'}>
                            Lista de Usuarios <Icon as={BsPeopleFill} />
                          </Text>
                        </MenuItem>
                      </>
                    )}
                    <PDFDownloadLink
                      document={<CreatePdf listOfClients={allClients} />}
                      fileName={`Clientes-${Date.now()}.pdf`}>
                      {({ loading }) =>
                        loading ? (
                          <button>Loading Document...</button>
                        ) : (
                          <MenuItem
                            bg={GlobalColors.BGRADIENTDEFAULT}
                            _hover={{ color: GlobalColors.EMPHASIZED }}
                            borderRadius={4}>
                            <Text
                              display={'flex'}
                              alignItems={'center'}
                              gap={1}
                              transition={'0.1s'}>
                              Descargar Clientes
                              <Icon as={FaFileDownload} />
                            </Text>
                          </MenuItem>
                        )
                      }
                    </PDFDownloadLink>
                    <PDFDownloadLink
                      document={<CreatePdf listOfClients={myClients} />}
                      fileName={`MisClientes-${Date.now()}.pdf`}>
                      {({ loading }) =>
                        loading ? (
                          <button>Loading Document...</button>
                        ) : (
                          <MenuItem
                            bg={GlobalColors.BGRADIENTDEFAULT}
                            _hover={{ color: GlobalColors.EMPHASIZED }}
                            borderRadius={4}>
                            <Text
                              display={'flex'}
                              alignItems={'center'}
                              gap={1}
                              transition={'0.1s'}>
                              Descargar Mis Clientes
                              <Icon as={FaFileDownload} />
                            </Text>
                          </MenuItem>
                        )
                      }
                    </PDFDownloadLink>
                    <MenuItem
                      bg={GlobalColors.BGRADIENTDEFAULT}
                      _hover={{ color: GlobalColors.EMPHASIZED }}
                      borderRadius={4}
                      onClick={() => logOut()}>
                      <Text
                        display={'flex'}
                        alignItems={'center'}
                        gap={1}
                        transition={'0.1s'}>
                        Cerrar Sesión <Icon as={HiOutlineLogout} />
                      </Text>
                    </MenuItem>
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

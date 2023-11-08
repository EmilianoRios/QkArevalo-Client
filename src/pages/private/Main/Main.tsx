import { LayoutPrivate } from '@/components'
import { ClientModelMap, GlobalColors, Roles } from '@/models'
import {
  DeleteDialog,
  DeleteManyDialog,
  FormClient,
  ListOfClients,
  Navbar
} from '@/pages'
import {
  getAllClientsForEmployeeService,
  getAllClientsService
} from '@/services'
import {
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { BsFillPersonFill, BsPeopleFill } from 'react-icons/bs'
import { HiOutlineRefresh } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_DOMAIN)

function Main() {
  const authState = useSelector(
    (state: { user: { id: string; name: string; role: string } }) => state.user
  )

  const emptyClient = {
    id: '',
    name: '',
    dni: '',
    status: ''
  }

  const [clientToDelete, setClientToDelete] = useState(emptyClient)

  const [isLoadingListButton, setIsLoadingListButton] = useState(false)
  const [switchList, setSwitchList] = useState(false)

  const [listOfClients, setListOfClients] = useState<ClientModelMap[]>([])
  const [myListOfClients, setMyListOfClients] = useState<ClientModelMap[]>([])

  //alertdialog delete client
  const {
    isOpen: isOpenDeleteDialog,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog
  } = useDisclosure()

  const {
    isOpen: isOpenDeleteManyDialog,
    onOpen: onOpenDeleteManyDialog,
    onClose: onCloseDeleteManyDialog
  } = useDisclosure()

  const handleSwitchList = () => {
    switchList ? setSwitchList(false) : setSwitchList(true)
  }

  const fetchClients = useCallback(async () => {
    setIsLoadingListButton(true)
    if (authState.role === Roles.ADMIN) {
      const [myClients, allClients] = await Promise.all([
        getAllClientsForEmployeeService(authState.id),
        getAllClientsService()
      ])

      setMyListOfClients(myClients)
      setListOfClients(allClients)
    } else if (authState.role === Roles.REGULAR) {
      await getAllClientsForEmployeeService(authState.id).then((res) => {
        setMyListOfClients(res)
      })
    }
    setIsLoadingListButton(false)
  }, [authState.id, authState.role])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const updateListOfClients = (
    index: number,
    data: ClientModelMap,
    listOfClients: ClientModelMap[]
  ) => {
    const newListOfClients = [...listOfClients]
    newListOfClients[index] = {
      ...newListOfClients[index],
      status: data.status
    }

    return newListOfClients
  }

  useEffect(() => {
    socket.on('server:updateListOfClients', (data) => {
      if (authState.role === Roles.ADMIN) {
        const indexListOfClients = listOfClients.findIndex(
          (client) => client.id === data.id
        )
        indexListOfClients !== -1
          ? setListOfClients(
              updateListOfClients(indexListOfClients, data, listOfClients)
            )
          : setListOfClients((oldList) => [data, ...oldList])
      }
      if (data?.employee.id === authState.id) {
        const indexMyListOfClients = myListOfClients.findIndex(
          (client) => client.id === data.id
        )

        indexMyListOfClients !== -1
          ? setMyListOfClients(
              updateListOfClients(indexMyListOfClients, data, myListOfClients)
            )
          : setMyListOfClients((oldList) => [data, ...oldList])
      }
    })

    socket.on('server:deleteOneClientOfLists', (id) => {
      if (authState.role === Roles.ADMIN) {
        const newListOfClients = listOfClients.filter(
          (client) => client.id !== id
        )
        setListOfClients(newListOfClients)
      }
      const newMyListOfClients = myListOfClients.filter(
        (client) => client.id !== id && client.employee?.id !== authState.id
      )

      setMyListOfClients(newMyListOfClients)
    })

    return () => {
      socket.off('server:updateListOfClients')
      socket.off('server:deleteOneClientOfLists')
    }
  }, [myListOfClients, listOfClients, authState.role, authState.id])

  return (
    <LayoutPrivate>
      <DeleteDialog
        isOpen={isOpenDeleteDialog}
        onClose={onCloseDeleteDialog}
        clientToDelete={clientToDelete}
        setClientToDelete={setClientToDelete}
        socket={socket}
      />
      <DeleteManyDialog
        isOpen={isOpenDeleteManyDialog}
        onClose={onCloseDeleteManyDialog}
        fetchClients={fetchClients}
      />
      <Navbar
        title={switchList ? 'Todos Los Clientes' : 'Mis Clientes'}
        fetchClients={fetchClients}
        onOpenDeleteManyDialog={onOpenDeleteManyDialog}
      />
      <Flex flexDirection={'column'} px={4}>
        <Divider my={4} />
        {switchList ? (
          <ListOfClients
            listOfClients={listOfClients}
            viewClientPerUser={true}
            onOpenDeleteDialog={onOpenDeleteDialog}
            setClientToDelete={setClientToDelete}
            socket={socket}
          />
        ) : (
          <ListOfClients
            listOfClients={myListOfClients}
            viewClientPerUser={false}
            onOpenDeleteDialog={onOpenDeleteDialog}
            setClientToDelete={setClientToDelete}
            socket={socket}
          />
        )}
        <Flex
          gap={4}
          justifyContent={'center'}
          alignItems={'center'}
          m={'0 auto'}>
          {authState.role === Roles.ADMIN && (
            <Button
              isLoading={isLoadingListButton}
              bgGradient={GlobalColors.SENDMESSAGEBUTTON}
              _hover={{
                bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
              }}
              p={4}
              w={'auto'}
              borderRadius={18}
              onClick={() => {
                handleSwitchList()
              }}>
              <Text
                display={'flex'}
                gap={1}
                alignItems={'center'}
                fontSize={{
                  base: '0.8rem',
                  md: '0.8rem',
                  lg: '0.9rem'
                }}>
                {switchList ? (
                  <>
                    Ir a Mis Clientes
                    <Icon as={BsFillPersonFill} />
                  </>
                ) : (
                  <>
                    Ir a Todos los Clientes
                    <Icon as={BsPeopleFill} />
                  </>
                )}
              </Text>
            </Button>
          )}
          <Button
            isLoading={isLoadingListButton}
            bgGradient={GlobalColors.SENDMESSAGEBUTTON}
            _hover={{
              bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
            }}
            p={4}
            w={'auto'}
            borderRadius={18}
            onClick={() => {
              fetchClients()
            }}>
            <Text
              display={'flex'}
              gap={1}
              alignItems={'center'}
              fontSize={{
                base: '0.8rem',
                md: '0.8rem',
                lg: '0.9rem'
              }}>
              Actualizar Lista
              <Icon as={HiOutlineRefresh} />
            </Text>
          </Button>
        </Flex>
        <Divider my={4} />
        <FormClient socket={socket} />
      </Flex>
    </LayoutPrivate>
  )
}
export default Main

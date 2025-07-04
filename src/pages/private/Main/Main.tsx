import { LayoutPrivate } from '@/components'
import { ClientModelMap, GlobalColors } from '@/models'
import {
  DeleteDialog,
  DeleteManyDialog,
  FormClient,
  ListOfClients,
  Navbar
} from '@/pages'
import {
  fetchNextPageAllClients,
  getAllClientsForEmployeeService,
  getAllClientsService
} from '@/services'
import { reducerClients } from '@/utils'
import {
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { BsFillPersonFill, BsPeopleFill } from 'react-icons/bs'
import { HiOutlineRefresh } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_DOMAIN)

function Main() {
  const authState = useSelector(
    (state: { user: { id: string; name: string; role: string } }) => state.user
  )

  const [currentPage, setCurrentPage] = useState(0)

  const emptyClient: ClientModelMap = {
    id: '',
    name: '',
    dni: '',
    status: '',
    employee: { id: '', name: '' }
  }

  const [clientToDelete, setClientToDelete] = useState(emptyClient)

  const [isLoadingListButton, setIsLoadingListButton] = useState(false)
  const [isLoadingViewMoreButton, setIsLoadingViewMoreButton] = useState(false)
  const [switchList, setSwitchList] = useState(false)

  const initialState: ClientModelMap[] = []

  const [allClients, dispatchAllClients] = useReducer(
    reducerClients,
    initialState
  )

  const [myClients, dispatchMyClients] = useReducer(
    reducerClients,
    initialState
  )

  const [totalClients, setTotalClients] = useState(0)
  const [totalMyClients, setTotalMyClients] = useState(0)

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

    const [myClients, allClients] = await Promise.all([
      getAllClientsForEmployeeService(authState.id),
      getAllClientsService()
    ])

    dispatchMyClients({ type: 'FETCH_SUCCESS', payload: myClients.myClients })
    dispatchAllClients({
      type: 'FETCH_SUCCESS',
      payload: allClients.allClients
    })

    setTotalMyClients(myClients.totalMyClients)
    setTotalClients(allClients.totalClients)

    setIsLoadingListButton(false)
  }, [authState.id])

  const fetchNextPage = useCallback(async () => {
    if (currentPage === 0) return
    setIsLoadingViewMoreButton(true)
    fetchNextPageAllClients(currentPage)
      .then((res) => {
        dispatchAllClients({ type: 'ADD_PAGE', payload: res.allClients })
      })
      .catch(() => {
        setIsLoadingViewMoreButton(false)
      })
      .finally(() => {
        setIsLoadingViewMoreButton(false)
      })
  }, [currentPage])

  useEffect(() => {
    fetchNextPage()
  }, [fetchNextPage])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  useEffect(() => {
    socket.on('server:updateListOfClients:ADMIN', (data) => {
      dispatchAllClients({ type: 'UPDATE_CLIENT', payload: data })
    })

    socket.on('server:addOneClient:ADMIN', (data) => {
      dispatchAllClients({ type: 'ADD_CLIENT', payload: data })
      setTotalClients(totalClients + 1)
    })

    socket.on('server:deleteOneClientOfLists:ADMIN', (id) => {
      dispatchAllClients({ type: 'DELETE_CLIENT', payload: id })
      setTotalClients(totalClients - 1)
    })

    socket.on(`server:updateMyListOfClients:${authState.id}`, (data) => {
      dispatchMyClients({ type: 'UPDATE_CLIENT', payload: data })
    })

    socket.on(`server:addOneClient:${authState.id}`, (data) => {
      dispatchMyClients({ type: 'ADD_CLIENT', payload: data })
      setTotalMyClients(totalMyClients + 1)
    })

    socket.on(`server:deleteOneClientOfLists:${authState.id}`, (id) => {
      dispatchMyClients({ type: 'DELETE_CLIENT', payload: id })
      setTotalMyClients(totalMyClients - 1)
    })

    return () => {
      socket.off('server:updateListOfClients:ADMIN')
      socket.off('server:addOneClient:ADMIN')
      socket.off('server:deleteOneClientOfLists:ADMIN')
      socket.off(`server:updateMyListOfClients:${authState.id}`)
      socket.off(`server:addOneClient:${authState.id}`)
      socket.off(`server:deleteOneClientOfLists:${authState.id}`)
    }
  }, [authState.role, authState.id, totalClients, totalMyClients])

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
        allClients={allClients}
        myClients={myClients}
        socket={socket}
        title={switchList ? 'Todos Los Clientes' : 'Mis Clientes'}
        onOpenDeleteManyDialog={onOpenDeleteManyDialog}
      />
      <Flex flexDirection={'column'} px={4}>
        <Divider my={4} />
        {switchList ? (
          <>
            <ListOfClients
              listOfClients={allClients}
              totalOfClients={totalClients}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              viewClientPerUser={true}
              switchList={switchList}
              onOpenDeleteDialog={onOpenDeleteDialog}
              setClientToDelete={setClientToDelete}
              isLoadingListButton={isLoadingListButton}
              isLoadingViewMoreButton={isLoadingViewMoreButton}
              socket={socket}
            />
          </>
        ) : (
          <ListOfClients
            listOfClients={myClients}
            totalOfClients={totalMyClients}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            viewClientPerUser={false}
            switchList={switchList}
            onOpenDeleteDialog={onOpenDeleteDialog}
            setClientToDelete={setClientToDelete}
            isLoadingListButton={isLoadingListButton}
            isLoadingViewMoreButton={isLoadingViewMoreButton}
            socket={socket}
          />
        )}
        <Flex
          gap={4}
          justifyContent={'center'}
          alignItems={'center'}
          m={'0 auto'}>
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
                  Mis Clientes
                  <Icon as={BsFillPersonFill} />
                </>
              ) : (
                <>
                  Todos los Clientes
                  <Icon as={BsPeopleFill} />
                </>
              )}
            </Text>
          </Button>
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
              setCurrentPage(0)
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

import { LayoutPrivate } from '@/components'
import { ClientModelMap, GlobalColors } from '@/models'
import { DeleteDialog, FormClient, ListOfClients, Navbar } from '@/pages'
import {
  getAllClientsForEmployeeService,
  getAllClientsService
} from '@/services'
import { Button, Divider, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DeleteManyDialog } from '@/pages'

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
    if (authState.role === 'ADMIN') {
      setIsLoadingListButton(true)
      const [myClients, allClients] = await Promise.all([
        getAllClientsForEmployeeService(authState.id),
        getAllClientsService()
      ])

      setMyListOfClients(myClients)
      setListOfClients(allClients)
    } else if (authState.role === 'REGULAR') {
      getAllClientsForEmployeeService(authState.id).then((res) => {
        setMyListOfClients(res)
      })
    }
    setIsLoadingListButton(false)
  }, [authState.id, authState.role])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return (
    <LayoutPrivate>
      <DeleteDialog
        isOpen={isOpenDeleteDialog}
        onClose={onCloseDeleteDialog}
        clientToDelete={clientToDelete}
        setClientToDelete={setClientToDelete}
        fetchClients={fetchClients}
      />
      <DeleteManyDialog
        isOpen={isOpenDeleteManyDialog}
        onClose={onCloseDeleteManyDialog}
        fetchClients={fetchClients}
      />
      <Navbar
        title='Mis Clientes'
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
            fetchClients={fetchClients}
          />
        ) : (
          <ListOfClients
            listOfClients={myListOfClients}
            viewClientPerUser={false}
            onOpenDeleteDialog={onOpenDeleteDialog}
            setClientToDelete={setClientToDelete}
            fetchClients={fetchClients}
          />
        )}
        <Flex
          gap={4}
          justifyContent={'center'}
          alignItems={'center'}
          m={'0 auto'}>
          {authState.role === 'ADMIN' && (
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
                fontSize={{
                  base: '0.8rem',
                  md: '0.8rem',
                  lg: '0.9rem'
                }}>
                {switchList ? 'Mis Clientes' : 'Todos los Clientes'}
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
              fontSize={{
                base: '0.8rem',
                md: '0.8rem',
                lg: '0.9rem'
              }}>
              Actualizar Lista
            </Text>
          </Button>
        </Flex>
        <Divider my={4} />
        <FormClient fetchClients={fetchClients} />
      </Flex>
    </LayoutPrivate>
  )
}
export default Main

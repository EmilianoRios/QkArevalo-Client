import { ClientModelMap } from '@/models'
import { CardClient, SearchClient } from '@/pages'
import { Button, Divider, Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

interface ListOfClientsProps {
  listOfClients: ClientModelMap[]
  totalOfClients: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  viewClientPerUser: boolean
  switchList: boolean
  onOpenDeleteDialog: () => void
  setClientToDelete: React.Dispatch<React.SetStateAction<ClientModelMap>>
  isLoadingListButton: boolean
  isLoadingViewMoreButton: boolean
  socket: Socket
}

const ListOfClients: React.FC<ListOfClientsProps> = ({
  listOfClients,
  totalOfClients,
  currentPage,
  setCurrentPage,
  viewClientPerUser,
  switchList,
  onOpenDeleteDialog,
  isLoadingListButton,
  isLoadingViewMoreButton,
  setClientToDelete,
  socket
}) => {
  const [listOfClientsFiltered, setListOfClientsFiltered] =
    useState<ClientModelMap[]>()
  const [searchTerm, setSearchTerm] = useState('')

  let numberClient = totalOfClients

  const handleSearch = useCallback(
    (searchText: string) => {
      setSearchTerm(searchText)

      const filteredItems = listOfClients.filter(
        (item: ClientModelMap) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.dni?.includes(searchText.replace(/\./g, '')) ||
          item.employee?.name?.toLowerCase().includes(searchText.toLowerCase())
      )

      setListOfClientsFiltered(filteredItems)
    },
    [listOfClients]
  )

  useEffect(() => {
    const handleSearch = (searchText: string) => {
      setSearchTerm(searchText)

      const filteredItems = listOfClients.filter(
        (item: ClientModelMap) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.dni?.includes(searchText.replace(/\./g, '')) ||
          item.employee?.name?.toLowerCase().includes(searchText.toLowerCase())
      )

      setListOfClientsFiltered(filteredItems)
    }

    setListOfClientsFiltered(listOfClients)
    handleSearch(searchTerm)
  }, [listOfClients, handleSearch, searchTerm])

  /* let numberOfClients = (listOfClients && listOfClients.length) || 0 */

  return (
    <>
      <VStack
        gap={2}
        h={'33.5vh'}
        overflowY={'scroll'}
        className={'list-of-clients'}
        py={1}>
        {listOfClientsFiltered &&
          listOfClientsFiltered.map((client: ClientModelMap) => {
            return (
              <CardClient
                key={client.id}
                viewClientPerUser={viewClientPerUser}
                index={numberClient--}
                searchTerm={searchTerm}
                client={client}
                switchList={switchList}
                onOpenDeleteDialog={onOpenDeleteDialog}
                setClientToDelete={setClientToDelete}
                socket={socket}
              />
            )
          })}
        <Flex gap={2}>
          {switchList &&
          !searchTerm &&
          Math.round(totalOfClients / 21) > currentPage ? (
            <Button
              isLoading={isLoadingViewMoreButton}
              size={'sm'}
              p={2}
              onClick={() => setCurrentPage(currentPage + 1)}>
              Cargar más
            </Button>
          ) : (
            ''
          )}
        </Flex>
        {!isLoadingListButton && listOfClients?.length === 0 && (
          <VStack pb={12}>
            <Text>{'No tienes ningún cliente!.'}</Text>
          </VStack>
        )}
        {isLoadingListButton && (
          <VStack
            p={10}
            justifyContent={'center'}
            alignItems={'center'}
            h={'100vh'}>
            <Spinner size={'lg'} />
          </VStack>
        )}
      </VStack>
      <Divider my={4} />
      <Flex justifyContent={'center'} alignItems={'center'}>
        {Math.round(totalOfClients / 21) > currentPage && (
          <Text fontSize={'xs'}>
            Si deseas buscar algún usuario asegurate de cargar todos los
            clientes.
          </Text>
        )}
      </Flex>
      <SearchClient
        searchTerm={searchTerm}
        handleSearch={(e) => handleSearch(e.target.value)}
      />
    </>
  )
}

export default ListOfClients

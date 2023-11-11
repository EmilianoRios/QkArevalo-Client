import { ClientModelMap, GlobalColors } from '@/models'
import { MenuClient, SearchClient } from '@/pages'
import { formatDNI } from '@/utils'
import {
  Card,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

interface ListOfClientsProps {
  listOfClients: ClientModelMap[]
  viewClientPerUser: boolean
  onOpenDeleteDialog: () => void
  setClientToDelete: React.Dispatch<React.SetStateAction<ClientModelMap>>
  isLoadingListButton: boolean
  socket: Socket
}

const ListOfClients: React.FC<ListOfClientsProps> = ({
  listOfClients,
  viewClientPerUser,
  onOpenDeleteDialog,
  isLoadingListButton,
  setClientToDelete,
  socket
}) => {
  const [listOfClientsFiltered, setListOfClientsFiltered] =
    useState<ClientModelMap[]>()
  const [searchTerm, setSearchTerm] = useState('')

  const setColorStatus = (status: string) => {
    if (status === 'PAID') {
      return GlobalColors.BGRADIENTPAID
    } else if (status === 'PENDING') {
      return GlobalColors.BGRADIENTPENDING
    } else if (status === 'CANCELLED') {
      return GlobalColors.BGRADIENTCANCELLED
    }

    return GlobalColors.BGRADIENTDEFAULT
  }

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
        h={'49vh'}
        overflowY={'scroll'}
        className={'list-of-clients'}>
        {listOfClientsFiltered &&
          listOfClientsFiltered.map((client: ClientModelMap, index, array) => {
            return (
              <Card
                w={'100%'}
                key={client.id}
                bgGradient={`linear-gradient(90deg, ${
                  GlobalColors.BGGRADIENTPRIMARY
                },${setColorStatus(client.status)} )`}
                border='1px solid'
                borderColor={GlobalColors.BORDERCONTENT}>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Flex
                    p={2}
                    overflow={'hidden'}
                    gap={4}
                    alignContent={'center'}
                    alignItems={'center'}>
                    {!searchTerm && (
                      <Flex w={'auto'}>
                        <Heading textAlign={'center'} fontSize={'2rem'}>
                          {array.length - index}
                        </Heading>
                      </Flex>
                    )}
                    <Flex flexDirection={'column'}>
                      <Heading size={'md'} noOfLines={1} fontSize={'0.9rem'}>
                        {client.name}
                      </Heading>
                      <Text color={GlobalColors.EMPHASIZED} fontSize={'0.8rem'}>
                        {formatDNI(client.dni) || 'Sin DNI.'}
                      </Text>
                      {viewClientPerUser && (
                        <Text fontSize={'0.7rem'}>
                          De: {client.employee?.name}
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                  <MenuClient
                    onOpenDeleteDialog={onOpenDeleteDialog}
                    client={client}
                    setClientToDelete={setClientToDelete}
                    socket={socket}
                  />
                </Flex>
              </Card>
            )
          })}
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
      <SearchClient
        searchTerm={searchTerm}
        handleSearch={(e) => handleSearch(e.target.value)}
      />
    </>
  )
}

export default ListOfClients

import { ClientModelMap, GlobalColors } from '@/models'
import { MenuClient, SearchClient } from '@/pages'
import { Card, Divider, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

interface ListOfClientsProps {
  listOfClients: ClientModelMap[]
  viewClientPerUser: boolean
  onOpenDeleteDialog: () => void
  fetchClients: () => void
  socket: Socket
  setClientToDelete: React.Dispatch<React.SetStateAction<ClientModelMap>>
}

const ListOfClients: React.FC<ListOfClientsProps> = ({
  listOfClients,
  viewClientPerUser,
  onOpenDeleteDialog,
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value
    setSearchTerm(searchText)

    const filteredItems = listOfClients.filter(
      (item: ClientModelMap) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.dni?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.employee?.name?.toLowerCase().includes(searchText.toLowerCase())
    )

    setListOfClientsFiltered(filteredItems)
  }

  useEffect(() => {
    setListOfClientsFiltered(listOfClients)
  }, [listOfClients])

  /* let numberOfClients = (listOfClients && listOfClients.length) || 0 */

  return (
    <>
      <Flex
        h={'60vh'}
        overflow={'auto'}
        flexDirection={'column'}
        gap={2}
        className={'list-of-clients'}>
        {listOfClientsFiltered &&
          listOfClientsFiltered.map((client: ClientModelMap, index, array) => {
            return (
              <Card
                key={client.id}
                p={2}
                bgGradient={`linear(to-tr, ${
                  GlobalColors.BGGRADIENTPRIMARY
                },${setColorStatus(client.status)} )`}
                border='1px solid'
                borderColor={GlobalColors.BORDERCONTENT}>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Flex
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
                        {client.dni || 'Sin DNI.'}
                      </Text>
                      {viewClientPerUser && (
                        <Text fontSize={'0.7rem'}>
                          De: {client.employee?.name}
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                  <Flex>
                    <MenuClient
                      onOpenDeleteDialog={onOpenDeleteDialog}
                      client={client}
                      setClientToDelete={setClientToDelete}
                      socket={socket}
                    />
                  </Flex>
                </Flex>
              </Card>
            )
          })}
        {listOfClients?.length === 0 && (
          <VStack pb={12}>
            <Text>{'No tienes ningún cliente!.'}</Text>
          </VStack>
        )}
      </Flex>
      <Divider my={4} />
      <SearchClient searchTerm={searchTerm} handleSearch={handleSearch} />
    </>
  )
}

export default ListOfClients

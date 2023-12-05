import { ClientModelMap, GlobalColors, Roles, StatusClient } from '@/models'
import { formatDNI } from '@/utils'
import { Button, Card, Flex, Heading, IconButton, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import { MenuClient } from '../MenuClient'

interface CardClientProps {
  viewClientPerUser: boolean
  searchTerm: string
  switchList: boolean
  client: ClientModelMap
  index: number
  onOpenDeleteDialog: () => void
  setClientToDelete: React.Dispatch<React.SetStateAction<ClientModelMap>>
  socket: Socket
}

const CardClient: React.FC<CardClientProps> = ({
  viewClientPerUser,
  searchTerm,
  switchList,
  client,
  index,
  onOpenDeleteDialog,
  setClientToDelete,
  socket
}) => {
  const authState = useSelector(
    (state: { user: { id: string; name: string; role: string } }) => state.user
  )

  const [openOptions, setOpenOptions] = useState('none')

  const setColorStatus = (status: string) => {
    if (status === StatusClient.PAID) {
      return GlobalColors.BGRADIENTPAID
    } else if (status === StatusClient.PENDING) {
      return GlobalColors.BGRADIENTPENDING
    } else if (status === StatusClient.CANCELLED) {
      return GlobalColors.BGRADIENTCANCELLED
    }

    return GlobalColors.BGRADIENTDEFAULT
  }

  return (
    <>
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
            w={'100%'}
            overflow={'hidden'}
            gap={4}
            alignContent={'center'}
            alignItems={'center'}>
            <Flex gap={2}>
              {!searchTerm && (
                <Flex w={'auto'}>
                  <Heading textAlign={'center'} fontSize={'1.5rem'}>
                    {index}
                  </Heading>
                </Flex>
              )}
              <Flex flexDirection={'column'}>
                <Heading size={'md'} noOfLines={2} fontSize={'0.9rem'}>
                  {client.name}
                </Heading>
                <Text color={GlobalColors.EMPHASIZED} fontSize={'0.8rem'}>
                  {formatDNI(client.dni) || 'Sin DNI.'}
                </Text>
                {viewClientPerUser && (
                  <Text fontSize={'0.7rem'}>De: {client.employee?.name}</Text>
                )}
              </Flex>
            </Flex>
          </Flex>
          {authState.role === Roles.REGULAR && switchList === true ? (
            ''
          ) : (
            <Button
              bg={GlobalColors.BGCONTENT}
              _hover={{ bg: GlobalColors.BGCONTENT }}
              rounded={
                openOptions === 'none' ? '0px 4px 4px 0px' : '0px 4px 0px 0px'
              }
              h={'100%'}
              as={IconButton}
              icon={
                openOptions === 'none' ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )
              }
              aria-label='Options-Client'
              onClick={() => {
                openOptions === 'none'
                  ? setOpenOptions('flex')
                  : setOpenOptions('none')
              }}
            />
          )}
        </Flex>
        {authState.role === Roles.REGULAR && switchList === true ? (
          ''
        ) : (
          <MenuClient
            openOptions={openOptions}
            setOpenOptions={setOpenOptions}
            onOpenDeleteDialog={onOpenDeleteDialog}
            client={client}
            setClientToDelete={setClientToDelete}
            socket={socket}
          />
        )}
      </Card>
    </>
  )
}

export default CardClient

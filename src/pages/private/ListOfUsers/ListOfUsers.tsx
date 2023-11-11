import { GlobalColors, PrivateRoutes, Roles } from '@/models'
import { getAllUsersService } from '@/services'
import { Button, Card, Flex, Heading, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ListOfUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<any>()

  const fetchUsers = () => {
    getAllUsersService().then((res) => {
      setUsers(res)
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <Flex
        flexDirection={'column'}
        justifyContent={'center'}
        justifyItems={'center'}
        alignContent={'center'}
        alignItems={'center'}
        h={'100vh'}
        m={'0 auto'}>
        <Flex
          display={'column'}
          bg={GlobalColors.BGCONTENT}
          border='1px solid'
          rounded={20}
          borderColor={GlobalColors.BORDERCONTENT}
          w={{ base: '80%', md: '80%', lg: '10%' }}
          maxW={{ base: '400px', lg: '400px' }}
          minW={{ lg: '400px' }}
          overflow={'hidden'}>
          <Flex justifyContent={'space-between'}>
            <Heading p={4} size={'lg'}>
              Lista de Usuarios
            </Heading>
            <Button
              h={'60px'}
              borderRadius={'0px 18px 0px 18px'}
              bg={GlobalColors.BORDERCONTENT}
              _hover={{
                bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
              }}
              onClick={() => {
                navigate(`/${PrivateRoutes.PRIVATE}`)
              }}>
              Volver
            </Button>
          </Flex>
          <VStack p={4}>
            <Flex direction={'column'} gap={2} w={'100%'}>
              {users &&
                users.map((user: any) => (
                  <Card
                    w={'100%'}
                    key={user.id}
                    bgGradient={`linear-gradient(90deg, ${GlobalColors.BGGRADIENTPRIMARY},${GlobalColors.BGRADIENTDEFAULT} )`}
                    border='1px solid'
                    borderColor={GlobalColors.BORDERCONTENT}>
                    <Flex
                      alignItems={'center'}
                      justifyContent={'space-between'}>
                      <Flex
                        p={2}
                        overflow={'hidden'}
                        gap={4}
                        alignContent={'center'}
                        alignItems={'center'}>
                        <Flex flexDirection={'column'}>
                          <Heading
                            size={'md'}
                            noOfLines={1}
                            fontSize={'0.9rem'}>
                            {user.name}
                          </Heading>
                        </Flex>
                      </Flex>
                      <Flex pr={4}>
                        {user.role === Roles.ADMIN && (
                          <Heading
                            size={'md'}
                            noOfLines={1}
                            fontSize={'0.9rem'}>
                            ADMIN
                          </Heading>
                        )}
                        {user.role === Roles.REGULAR && (
                          <Heading
                            size={'md'}
                            noOfLines={1}
                            fontSize={'0.9rem'}>
                            RPP
                          </Heading>
                        )}
                      </Flex>
                      {/* TODO MENU USER */}
                    </Flex>
                  </Card>
                ))}
            </Flex>
          </VStack>
        </Flex>
      </Flex>
    </>
  )
}

export default ListOfUsers

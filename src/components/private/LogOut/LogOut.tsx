import { GlobalColors } from '@/models'
import { resetUser } from '@/redux'
import { Button, Icon, Text } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { HiOutlineLogout } from 'react-icons/hi'

const LogOut = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logOut = () => {
    dispatch(resetUser())
    navigate(`/`)
  }

  return (
    <Button
      fontWeight={'normal'}
      variant='link'
      fontSize={{ base: '0.81rem', sm: '0.85rem', lg: 'unset' }}
      color={'white'}
      textDecoration={'none'}
      _hover={{
        textDecoration: 'none',
        color: GlobalColors.EMPHASIZED
      }}
      onClick={logOut}>
      <Text display={'flex'} alignItems={'center'} gap={1}>
        Cerrar Sesión <Icon as={HiOutlineLogout} />
      </Text>
    </Button>
  )
}

export default LogOut

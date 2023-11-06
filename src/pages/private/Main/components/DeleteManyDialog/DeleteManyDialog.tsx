import { GlobalColors } from '@/models'
import { deleteManyClientsService } from '@/services'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'

interface DeleteManyDialogProps {
  isOpen: boolean
  onClose: () => void
  fetchClients: () => void
}

const DeleteManyDialog: React.FC<DeleteManyDialogProps> = ({
  isOpen,
  onClose,
  fetchClients
}) => {
  const authState = useSelector(
    (state: { user: { id: string; name: string; role: string } }) => state.user
  )

  const deleteManyClients = () => {
    try {
      deleteManyClientsService(authState.id).then(() => {
        fetchClients()
      })
      onClose()
    } catch {
      onClose()
    }
  }

  const cancelRef = React.useRef(null)
  return (
    <>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent bg={GlobalColors.BORDERCONTENT}>
          <AlertDialogHeader>Eliminar Clientes</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text>
              Estas seguro que deseas eliminar todos tus clientes{' '}
              <Text as='b'>{authState.name}</Text>?
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              bgGradient={GlobalColors.WARNINGCOLOR}
              ml={3}
              onClick={() => {
                deleteManyClients()
              }}>
              Eliminar Todos
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteManyDialog

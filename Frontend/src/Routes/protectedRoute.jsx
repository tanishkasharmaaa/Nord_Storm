import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ProtectedRoute = () => {
  const token = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!token || !username) {
      onOpen(); // Open modal only when there is no token
    }
  }, [token, username, onOpen]);

  return token && username ? (
    <Outlet />
  ) : (
    <>
      {/* Modal for Login Prompt */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Access Denied</ModalHeader>
          <ModalBody>
            <Text>You need to log in to access this page.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              borderRadius="none"
              colorScheme="blue"
              onClick={() => (window.location.href = "https://nord-storm.onrender.com/auth/google")}
            >
              Go to Login
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProtectedRoute;

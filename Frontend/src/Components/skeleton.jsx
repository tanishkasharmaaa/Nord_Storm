import { SimpleGrid,Box,SkeletonText ,Skeleton} from "@chakra-ui/react"

function SkeletonStr(){
    return(
        <SimpleGrid columns={[1, 2, 3, 4]} spacing="10px">
          {[...Array(8)].map((_, index) => (
            <Box key={index} p="4" border="1px solid grey">
              <Skeleton height="300px" width="230px" />
              <Box mt="4">
                <SkeletonText noOfLines={1} spacing="4" skeletonHeight="20px" />
                <SkeletonText noOfLines={1} spacing="4" skeletonHeight="15px" width="50%" />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
    )
}

export default SkeletonStr
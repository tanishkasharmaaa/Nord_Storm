function QuickView(){
    const {id} = useParams();
    const [products,setProduct] = useState([])
    const getProduct=async ()=>{
    try {
        const response = await fetch(`https://nord-storm.onrender.com/products`);
        const data = await response.json()
        setProduct(data.products)
        console.log(data.products)
    } catch (error) {
      console.log(error)  
    }
    }
    useEffect(()=>{
        getProduct()
    },[])
    return (<>
   <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          Open Dialog
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                {id}
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    </>)
}
export default QuickView
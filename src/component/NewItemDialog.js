import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CATEGORY, SIZE, STATUS } from "../constants/product.constants";
import { productActions } from "../redux/actions/productAction";
import "../style/adminProduct.style.css";
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: "",
};
const NewItemDialog = ({ mode, showDialog, setShowDialog, searchQuery }) => {
  const { loading, error, selectedProduct } = useSelector((state) => state.product);
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : {...selectedProduct }
  );
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    //수정 데이터 바로 불러와 지도록, 컴포넌트가 마운트될 때 selectedProduct가 초기에 값이 없는 경우 제어되지 않는 상태에 대한 경고 해결
    if(mode === "new"){
      setFormData({ ...InitialFormData })
      setStock([]);//상품 수정 화면 열었다가 상품 생성 열었을 때 이전에 수정한 상품 stock안불러와지게
    } else {
      setFormData({...selectedProduct }) 
      //selectedProduct의 stock객체를 배열로 바꾼뒤 setStock에 넣는다 ex){ S:2, M:2 } =>[[S:2], [M,2]] 
      const stockArrary = Object.entries(selectedProduct.stock);
      setStock(stockArrary);
    }
  }, [mode, selectedProduct, showDialog]);

  const handleClose = () => {
    //다이얼로그 닫아주기
    setShowDialog(false);
    //모든걸 초기화시키기
    mode === "new" ? setFormData({ ...InitialFormData }) : setFormData({...selectedProduct})
    setStock([]);
  };

  const handleChange = (event) => {
    //formData에 데이터 넣어주기
    const {id, value} = event.target;
    if (id === 'price') {
      let parsedValue = parseInt(value);
      if(parsedValue >= 1) {
        setFormData({...formData, [id]: value});
      } 
    } else {
      setFormData({...formData, [id]: value});
    }
  };

  const addStock = (sizeLength) => { //이전 코드
    if(stock.length < sizeLength) {
      setStock([...stock, []]);
      setStockError(false)
    }
  };

  const deleteStock = (index) => { //기존 코드
    //삭제 클릭한 index 제외
    const newStock = stock.filter((item, idx) => idx !== index);
    setStock(newStock);
  };

  // 내부 배열도 새로운 배열로 생성
  const handleStockSizeChange = (value, index) => {
    //value는 사이즈, index는 stock의 인덱스
    const newStock = stock.map((item, idx) => {
      if (idx === index) return [value, item[1]]; 
      return item;
    });
    setStock(newStock);
  }
  const handleStockQtyChange = (value, index) => {
    //value는 수량, index는 stock의 인덱스
    const newStock = stock.map((item, idx) => {
      if (idx === index && value >= 0) return [item[0], value];  
      return item;
    });
    setStock(newStock);
  };
  
  const onHandleCategory = (event) => {
    const {id, value} = event.target;
    //카테고리 이미 추가되어있으면 제거 
    if (formData.category.includes(value)) {
      const newCategory = formData.category.filter(
        (item) => item !== value
      ); 
      setFormData({
        ...formData,
        [id]: [...newCategory],
      });
      //아니면 추가
    } else {
      setFormData({
        ...formData,
        [id]: [...formData.category, value],
      });
    }
  };

  const uploadImage = (url) => {
    //이미지 업로드
    setFormData({...formData, image:url});
    setImageError(false)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    //재고를 입력하지 않았으면 에러
    if(stock?.length === 0) {
      setStockError(true);
      return;
    }
    if(!formData.image) {
      setImageError(true);
      return;
    }
    // 재고를 배열에서 객체로 바꿔주기 => [['M',2]] 에서 {M:2}로
    let stockObj = stock.reduce((total, item) => {
      return {...total, [item[0]]: parseInt(item[1])};
    },{});

    if (mode === "new") {
      //새 상품 만들기 후 미들웨어에서 다시 조회 함수 호출
      dispatch(productActions.createProduct({...formData, stock:stockObj},{...searchQuery}));
    } else {
      // 상품 수정하기
      dispatch(productActions.updateProduct({...formData, stock:stockObj},{...searchQuery}));
    }
    handleClose();
  };


  return (
    <Modal show={showDialog} onHide={handleClose}>
      {loading && (
        <div className="spinner-box">
          <Spinner animation="border" role="status">
            <span className="visually-hidden loading-message">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && (
        <div>
          <Alert variant="danger" className="error-message">
            {error}
          </Alert>
        </div>
      )}
      
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>Create New Product</Modal.Title>
        ) : (
          <Modal.Title>Edit Product</Modal.Title>
        )}
      </Modal.Header>

      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Sku"
              required
              value={formData.sku}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Name"
              required
              value={formData.name}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="string"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          {stockError && (
            <span className="error-message mr-1">재고를 추가해주세요</span>
          )}
          <Button size="sm" onClick={() => addStock(SIZE.length)}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={`${item[0]}_${index}`}>
                <Col sm={5}>
                  <Form.Select
                    onChange={(event) =>
                      handleStockSizeChange(event.target.value, index)
                    }
                    required
                    defaultValue={item[0] ? item[0].toUpperCase() : ""}
                  >
                    <option value="" disabled hidden>
                      please choose size of stock
                    </option>
                    {SIZE.map((size, index) => (
                      <option
                        value={size.toUpperCase()}
                        disabled={stock.some((stockItem) => stockItem[0] === size.toUpperCase())}
                        key={index}
                      >
                        {size}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) =>
                      handleStockQtyChange(event.target.value, index)
                    }
                    type="number"
                    placeholder="please set quantity of stock"
                    value={item[1] || ''}
                    required
                  />
                </Col>
                <Col sm={1}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>
          
        <Form.Group className="mb-3" controlId="image" required>
          <Form.Label className="mr-1">Image</Form.Label>
          {imageError && (
            <span className="error-message">이미지를 업로드 해주세요</span>
          )}
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          <Image
            id="uploadedimage"
            src={formData.image}
            className="upload-image mt-2 ml-2"
            alt="uploadedimage"
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={formData.price}
              required
              onChange={handleChange}
              type="number"
              placeholder="price"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              multiple
              onChange={onHandleCategory}
              value={formData.category}
              required
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        {mode === "new" ? (
          <Button variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default NewItemDialog;

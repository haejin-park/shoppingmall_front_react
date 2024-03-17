import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CATEGORY, SIZE, STATUS } from "../constants/product.constants";
import "../style/adminProduct.style.css";
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";
import { productActions } from "../redux/actions/productAction";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: 0,
};
const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { loading, error, selectedProduct } = useSelector((state) => state.product);
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : {...selectedProduct }
  );
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);
  const [formDataError, setFormDataError] = useState(false);

  useEffect(() => {
    //수정 데이터 바로 불러와 지도록, 컴포넌트가 마운트될 때 selectedProduct가 초기에 값이 없는 경우 제어되지 않는 상태에 대한 경고 해결
    if(mode === "new"){
      setFormData({ ...InitialFormData })
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

  const handleSubmit = (event) => {
    event.preventDefault();
    //재고를 입력하지 않았으면 에러
    if(stock?.length === 0) {
      setStockError(true);
      return;
    }
    // 재고를 배열에서 객체로 바꿔주기 => [['M',2]] 에서 {M:2}로
    let stockObj = stock.reduce((total, item) => {
      return {...total, [item[0]]: parseInt(item[1])};
    },{});
    console.log('stockObj',stockObj);
    if(!formData) setFormDataError(true);
    if (mode === "new") {
      //새 상품 만들기
      dispatch(productActions.createProduct({...formData, stock:stockObj}));
    } else {
      // 상품 수정하기
      dispatch(productActions.editProduct({...formData, stock:stockObj}));
    }
    handleClose();
  };

  const handleChange = (event) => {
    //formData에 데이터 넣어주기
    event.preventDefault();
    const {id, value} = event.target;
    setFormData({...formData, [id]: value});
  };

  const addStock = (sizeLength) => {
    if(stock.length < sizeLength) {
      setStock([...stock, []]);
      setStockError(false)
    }
  };

  const deleteStock = (index) => {
    //삭제 클릭한 index 제외
    const newStock = stock.filter((item, idx) => index !== idx)
    setStock(newStock);
  };

  const handleSizeChange = (value, index) => {
    //value는 사이즈, index는 stock의 인덱스
    const newStock = [...stock];
    newStock[index][0] = value;
    setStock([...newStock]);
  };

  const handleStockChange = (value, index) => {
    //value는 수량, index는 stock의 인덱스
    const newStock = [...stock];
    if(value >= 0) {
      newStock[index][1] = value;
    }
    setStock([...newStock]);
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
  };

  useEffect(() => {
    if (showDialog) {
      if (mode === "edit") {
        // 선택된 데이터값 불러오기 (재고 형태 객체에서 어레이로 바꾸기)
      } else {
        // 초기화된 값 불러오기
        setFormData({ ...InitialFormData })
      }
    }
  }, [showDialog]);

  //에러나면 토스트 메세지 보여주기

  return (
    <Modal show={showDialog} onHide={handleClose}>
      {loading && (
        <div className="spinner-box">
          <Spinner animation="border" role="status">
            <span className="visually-hidden loading-message">Loading...</span>
          </Spinner>
        </div>
      )}
      {(error || formDataError) && (
        <div>
          <Alert variant="danger" className="error-message">
            {error || '빈 값을 입력해주세요'}
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
            <span className="error-message">재고를 추가해주세요</span>
          )}
          <Button size="sm" onClick={() => addStock(SIZE.length)}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={index}>
                <Col sm={5}>
                  <Form.Select
                    onChange={(event) =>
                      handleSizeChange(event.target.value, index)
                    }
                    required
                    defaultValue={item[0] ? item[0].toUpperCase() : ""}
                  >
                    <option value="" disabled hidden>
                      please choose size of stock
                    </option>
                    {SIZE.map((item, index) => (
                      <option
                        value={item.toUpperCase()}
                        disabled={stock.some(
                          (size) => size[0] === item.toUpperCase()
                        )}
                        key={index}
                      >
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) =>
                      handleStockChange(event.target.value, index)
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
          
        <Form.Group className="mb-3" controlId="Image" required>
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          <img
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
              placeholder="0"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
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
            </Form.Control>
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

import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Dropdown, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as types from '../constants/order.constants';
import { cartActions } from "../redux/actions/cartAction";
import { productActions } from "../redux/actions/productAction";
import { commonUiActions } from "../redux/actions/commonUiAction";
import "../style/productDetail.style.css";

const ProductDetail = ({mode, cartProductId, setShowDialog, setMode}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [query, setQuery] = useSearchParams(); 
  const searchKeyword = query.get("searchKeyword") || ''; 
  const { user } = useSelector((state) => state.user);
  const { product, loading, error } = useSelector((state) => state.product);
  const { selectedItem, currentPage } = useSelector((state) => state.cart);
  const [ cartItemInitialOption ] = useState([[selectedItem?.items?.size, selectedItem?.items?.qty]]);
  const [ selectedOption, setSelectedOption ] = useState(mode === "edit"? [[selectedItem?.items?.size, selectedItem?.items?.qty]] : []);
  const [ optionChangeStatus, setOptionChangeStatus ] = useState(false);
  const [ sizeError, setSizeError ] = useState(false);
  const [ qtyError, setQtyError ] = useState(false);
  const [ totalPrice, setTotalPrice ] = useState(0);
  const [ deletedProductError, setDeletedProductError ] = useState(false);

  useEffect(() => {
    //상품 디테일 정보 가져오기
    if(id) {
      dispatch(productActions.getProductDetail(id));
    } else if(cartProductId) {
      dispatch(productActions.getProductDetail(cartProductId));
    }
  }, [id, cartProductId, dispatch]);

  useEffect(() => {
    product.isDeleted ? setDeletedProductError(true) : setDeletedProductError(false);
  },[product]);
  /*
    todo 
    장바구니 상품 기존 옵션과 선택한 옵션 일치하지 않으면 (optionChangeStatus true일 때) 
    => 장바구니 옵션 수정시 완료 버튼 활성화

    optionChangeStatus 
    => false disabled
    => true  버튼 활성화

    selectedOption[i][0] => 사이즈
    selectedOption[i][1] => 수량 

    버튼 사용 불가능한 경우 setOptionChangeStatus(false)
    => selectedOption의 길이가 0보다 작은 경우 
    => selectedOption의 길이가 0이상이고 && 길이가 같고 && (수량 일치 && 사이즈 일치)

    사용 가능 한 경우 setOptionChangeStatus(true)
    => selectedOption의 길이가 0이상이고 && 길이가 다른 경우 && 수량이 1이상
    => selectedOption의 길이가 0이상이고 && 길이가 같고 && 수량이 1이상 && (수량 일치 하지 않거나 || 사이즈 일치하지 않거나) 
  */

  useEffect(() => {
    if(selectedOption.length <= 0) {
      setOptionChangeStatus(false);
      return;
    } 
    if(cartItemInitialOption.length !== selectedOption.length) {
      for(let i = 0; i < cartItemInitialOption.length; i++) {
          if(selectedOption[i][1] >= 1) {
            setOptionChangeStatus(true);
            break;
          }
        }
    } else { 
      for(let i = 0; i < cartItemInitialOption.length; i++) {
        if(cartItemInitialOption[i][0] !== selectedOption[i][0] || cartItemInitialOption[i][1] !== selectedOption[i][1]) {
          if(selectedOption[i][1] >= 1) {
            setOptionChangeStatus(true);
            break;
          }
        } 
        setOptionChangeStatus(false);
      }
    }
  }, [cartItemInitialOption, selectedOption])
  
  useEffect(() => {
    if(selectedOption.length > 0) {
      const totalPrice = selectedOption.reduce((total, option) => {
        let sizePrice = product.price;
        if(option[1]) {
          sizePrice *=  parseInt(option[1]); //사이즈 수량 있으면 곱해주기
        } else {
          sizePrice = 0
        } 
        return total + sizePrice//사이즈만 선택했을 땐 수량은 selectedOption에 존재하지 않는 상태
      },0)
      setTotalPrice(totalPrice)
    } 
  },[product.price, selectedOption]);

/*
  => cartItemInitialOption과 다른 변경 사항만 add되도록
  ex)
  기존 옵션 cartItemInitialOption 
  [['M', 1]] => 객체 변환시 {M:1}
  
  선택 옵션 selectedOption 
  [['S', 1], ['M', 2]] => 객체 변환시 {S:1, M:2}

  1. mode가 edit이고, optionChangeStatus true일 때

  2. 객체로 변경(선택한건 원래 바꾸게 되어있었으니까 기존 옵션만 추가로 객체로 바꿔주면 됨)

  3. 백엔드에 수정할 상품 아이디, 초기옵션, 선택 옵션  보내서 비교하여 처리
  => userId로 카트 전체 상품 조회(상품 아이디와 사이즈로 일치하는 상품 존재 여부 확인 및 업데이트하기 위해 조회)
  => 초기옵션, 선택 옵션 키를 모두 포함한 배열 생성
  => 배열 반복 돌려 선택 옵션 수량, 초기옵션 수량 만들기, 상품 아이디와 사이즈로 장바구니내 상품과 일치하는 상품 존재 여부
  => 선택한 옵션에만 수량이 있고 초기 옵션에는 수량이 없을 경우 => 기존에 장바구니에 아이템이 있는 경우 : 수량 추가 / 없는 경우: 아이템 추가
  => 선택한 옵션 수량이 있고, 선택 옵션과 초기 옵션 수량이 다른 경우: 수량 수정
  => 선택한 옵션에는 수량이 없고 초기 옵션에는 수량이 있을 경우: 삭제
  => 기존 장바구니 아이템에 업데이트된 아이템 추가 후 저장
*/ 
  const checkProductAndOptionAndUser = async() => {
    //삭제된 상품이라면 return
    if(deletedProductError) {
      return Promise.reject();
    }

    //선택한 옵션(사이즈)이 없다면 에러
    if(selectedOption.length === 0) {
      setSizeError(true);
      return Promise.reject();
    }

    //수량이 1보다 작아서 에러가 있다면 return
    if(qtyError) {
      return Promise.reject();
    }

    if(!user) {
      dispatch(commonUiActions.showToastMessage("로그인 후 이용 가능합니다.", "error"));
      navigate('/login');
      return Promise.reject();

    }
  }

  const initialState = () => {
    setDeletedProductError(false);
    setSelectedOption([]);
    setTotalPrice(0);
  }

  const addCartItem = async() => {
    try {
      await checkProductAndOptionAndUser()

      // 선택한 옵션을 배열에서 객체로 변경 => ex) [['S',1], ['M',2]] 에서 {S:1, M:2}로
      let selectedOptionObj =  Object.fromEntries(selectedOption);
  
      // 카트에 아이템 추가하기
      if(id) dispatch(cartActions.addToCart(id, selectedOptionObj));
      
      //추가 후 초기화
      initialState();
    } catch(error) {
      //checkProductAndOptionAndUser에서 promise반환 시 로그가 남기지 않기 위해 에러로그 제외
    }
  };

  const updateCartItem = async() => {
    try {
      await checkProductAndOptionAndUser()

      // 선택한 옵션을 배열에서 객체로 변경 => ex) [['S',1], ['M',2]] 에서 {S:1, M:2}로
      let cartItemInitialOptionObj = Object.fromEntries(cartItemInitialOption);
      let selectedOptionObj = Object.fromEntries(selectedOption);

      // 카트에 아이템 추가하기
      if(cartProductId) {
        dispatch(cartActions.updateCartItemQty(cartProductId, cartItemInitialOptionObj, selectedOptionObj, {searchKeyword, currentPage}));
        setShowDialog(false);
        setMode("");
      }
      
      //추가 후 초기화
      initialState();
    } catch(error) {
      //checkProductAndOptionAndUser에서 promise반환 시 로그가 남기지 않기 위해 에러로그 제외
    }
  };


  const goOrder = async() => {
    try {
      await checkProductAndOptionAndUser()
      let selectedOptionObj =  Object.fromEntries(selectedOption);
      let orderItemList = [];
      let productData = [product];
      for(const size of Object.keys(selectedOptionObj)){ 
        orderItemList = [{items:{productId:id, size, qty:selectedOptionObj[size]},productData}];
      }
      dispatch({type:types.SAVE_ORDER_ITEM, payload:{orderItemList, totalPrice, cartOrderStatus:false}});
      //초기화
      setDeletedProductError(false);
      setSelectedOption([]);
      setTotalPrice(0);
      navigate("/order");
    } catch(error) {
      //checkProductAndOptionAndUser에서 promise반환 시 로그가 남기지 않기 위해 에러로그 제외
    }
  }


  const handleSelectSize = (value) => {
    // 사이즈 선택하기(처음 사이즈 선택할 때 수량 1로 세팅되게)
    if(selectedOption?.length > 0){
      let newOption = [...selectedOption, [value,1]];
      setSelectedOption(newOption); 
    } else {
      setSelectedOption([[value,1]]);
    }
    setSizeError(false);     
  };

  /* 
    todo 
    product.stock반복 돌려서
    product.stock의 키값이 일치하면 
    product.stock["키값(해당 사이즈)"]으로 수량구해서 그것 보다 적거나 같은 수량까지만 장바구니에 담을 수 있도록 하기
  */
  const handleIncrement = (index) => {
    const newSelectedOption = [...selectedOption];
      if(newSelectedOption[index][1] >= 1) {
        newSelectedOption[index][1] += 1; 
      } else {
        newSelectedOption[index][1] = 1; 
      }
      setQtyError(false); // newSelectedOption[index][1]가 1이상이면 에러 메세지 사라지게
      setSelectedOption([...newSelectedOption]);
  };

  const handleDecrement = (index) => {
    const newSelectedOption = [...selectedOption];
    if (newSelectedOption[index][1] >= 1) {
      newSelectedOption[index][1] -= 1; 
    } 
    newSelectedOption[index][1] <= 0 && setQtyError(true);  // newSelectedOption[index][1]가 0이하이면 에러 메세지
    setSelectedOption([...newSelectedOption]);
  }

  const handleSelectQty = (value, index) => {
    //value는 수량, index는 selectedOption의 인덱스
    const newSelectedOption = [...selectedOption];
    newSelectedOption[index][1] = parseInt(value)
    value <= 0 || newSelectedOption[index][1] <= 0 ? setQtyError(true) : setQtyError(false); //변경 수량값이 0이하이거나 수량이 0이면 에러 메세지, 아니면 사라지게
    setSelectedOption([...newSelectedOption]);
  };

  const deleteSelectedOption = (index) => {
    const newSelectedOption = selectedOption.filter((option, idx) => index !== idx);
    setSelectedOption(newSelectedOption);
    const totalPrice = newSelectedOption.reduce((total, option) => {
      let sizePrice =  product.price; 
      if(option[1]) {
        sizePrice *= parseInt(option[1]);  
      } else {
        sizePrice = 0;
      }
      return total + sizePrice
    },0);
    setTotalPrice(totalPrice);
  }

  return (
    <Container className="product-detail-card">
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
      <Row>
        <Col sm={6}>
          <img src={product.image} className="w-100" alt={product.name} />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{product.name}</div>
          <div className="product-info">₩ {product.price}</div>
          <div className="product-info">{product.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            align="start"
            onSelect={(value) => handleSelectSize(value)}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              align="start"
            >
            사이즈 선택
            </Dropdown.Toggle>
            <Dropdown.Menu className="size-drop-down">
              {product.stock && Object.keys(product?.stock).map((size, index) => (
                <Dropdown.Item 
                  key={index} 
                  eventKey={size}
                  disabled={selectedOption.some(
                    (option) => option[0].toUpperCase() === size.toUpperCase()
                  )}
                >
                  {`${size} (재고 수량 ${product?.stock[size]})`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>          
          {selectedOption?.map((item, index) => (
            <div className="selected-option-box" key={index}>
              <Row className="selected-option-row">
                <Col sm={2} xs={2}>
                  {item[0]}
                </Col>
                <Col sm={8} xs={8}>
                  <InputGroup>
                    <Button variant="outline-secondary" onClick={() => handleDecrement(index)}>-</Button>
                      <Form.Control
                        type="number"
                        value={item[1] || ''}
                        onChange={(event) => handleSelectQty(event.target.value, index)}
                      />
                    <Button variant="outline-secondary" onClick={() => handleIncrement(index)}>+</Button>
                  </InputGroup>
                </Col>
                <Col sm={2} xs={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteSelectedOption(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <div className="warning-message">
            {sizeError && "사이즈를 선택해주세요."}
          </div>
          <div className="warning-message">
            {qtyError && "수량 1개 이상 선택가능합니다."}
          </div>
          <strong>Total: {totalPrice}</strong>
          {mode === "edit" ? (
          <Row className="cart-btn-row">
            <Col>
              <Button className="cart-cancel-btn" variant="secondary">
                취소
              </Button>
            </Col>
            <Col>
              <Button className="cart-complete-btn" variant="dark" onClick={updateCartItem} disabled={!optionChangeStatus && !deletedProductError}>
                수정 완료
              </Button>
            </Col>
          </Row>
          ) : (
          user?.level === "customer" && (  
          <Row className="product-detail-btn-row">
            <Col>
              <Button className="add-button" variant="dark" onClick={addCartItem}>
                장바구니
              </Button>     
            </Col>
            <Col>
              <Button className="order-button" variant="dark" onClick={goOrder}>
                주문하기
              </Button>
            </Col>
          </Row>
          )
          )}
          {deletedProductError && (
          <div className="deleted-product-error-message">
            <Alert variant="danger" className="error-message">
              상품이 삭제 되었습니다. 삭제된 상품은 장바구니 추가 또는 주문 할 수 없습니다.
            </Alert>
          </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;

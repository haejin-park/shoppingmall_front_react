import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import NewItemDialog from "../component/NewItemDialog";
import ProductTable from "../component/ProductTable";
import SearchBox from "../component/SearchBox";
import { productActions } from "../redux/actions/productAction";

const AdminProduct = () => {
  /*
  SearchBox에서 keyword로 검색어 읽어오기(엔터 치면 SearchQuery객체 update됨 ex {name:팬츠}) 
    => searchQuery객체 안에 아이템 기준으로 url새로 생성해서 호출 ex) &name=스트레이트+팬츠 
    => url쿼리 읽어오기
    => url쿼리 기준으로 back에 검색 조건과 함께 호출 
   */
  const dispatch = useDispatch();
  const {loading, error, productList, totalPageNum} = useSelector((state) => state.product);
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  const [mode, setMode] = useState("new");
  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  useEffect(() => { 
    //url쿼리 읽어오기(query) => 쿼리 값에 맞춰서 상품리스트 가져오기
    dispatch(productActions.getProductList({...searchQuery}));
  }, [query]);

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    //검색어 없으면 url에서도 삭제해서 첫 페이지로 돌아갈 수 있도록
    if(!searchQuery.name) delete searchQuery.name;
    //검색어나 페이지가 바뀌면 => 검색어를 파라미터 형태로 => url바꿔주기 
    const params = new URLSearchParams(searchQuery);
    const queryString =  decodeURIComponent(params.toString());
    navigate("?" + queryString)
  }, [searchQuery]);

  const deleteItem = (id) => {
    //아이템 삭제하기
  };

  const openEditForm = (product) => {
    //edit모드로 설정하고
    // 아이템 수정다이얼로그 열어주기
  };

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode('new');
    // 다이얼로그 열어주기
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  return (
    <div className="locate-center">
      <Container>
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
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={8}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1} // 1페이지면 여긴 2가됨 (한개씩 +1 되므로 -1해줘야함)
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />
    </div>
  );
};

export default AdminProduct;

import React from "react";
import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
const ProductTable = ({ header, productList, deleteItem, openEditForm }) => {
  return (
    <div className="overflow-x">
      {productList?.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((title, index) => (
                <th key={index}>{title}</th>
              ))}
            </tr>
          </thead>
            {productList?.map((item, index) => (
              <tbody key={index}>
                <tr>
                  <th>{index}</th>
                  <th>{item.sku}</th>
                  <th style={{ minWidth: "100px" }}>{item.name}</th>
                  <th>{item.price.toLocaleString()}</th>
                  <th>
                    {Object.keys(item.stock).map((size, index) => (
                      <div key={index}>
                        {size}:{item.stock[size]}
                      </div>
                    ))}
                  </th>
                  <th>
                    <img src={item.image} width={100} alt="image" />
                  </th>
                  <th>{item.status}</th>
                  <th style={{ minWidth: "100px" }}>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteItem(item._id)}
                      className="mr-1"
                    >
                      -
                    </Button>
                    <Button size="sm" onClick={() => openEditForm(item)}>
                      Edit
                    </Button>
                  </th>
                </tr>
              </tbody>
            ))}
        </Table>
        ) : (
        <div>
          <Alert variant="danger" className="error-message">
            조회된 상품이 없습니다
          </Alert>
        </div> 
        )}
    </div>
  );
};
export default ProductTable;

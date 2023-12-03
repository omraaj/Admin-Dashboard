/**
 * The `Product` component is a React component that displays a table of products with the ability to
 * search, filter, and delete products.
 * @returns The Product component is returning a React Fragment containing a heading and a DataTable
 * component.
 */
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
export default function Product()
{
    const columns= [
        {
            name:"ID",
            selector:(row)=>row.id,
           
        },
        {
            name:"Name",
            selector:(row)=>row.name,
            editable:true,
            isEditing:true,
        },
        {
            name:"Email",
            selector:(row)=>row.email,
            editable:true,
        },
        {
            name:"Role",
            selector:(row)=>row.role,
            editableRow:true,
        },
        
        {
            name:"Action",
            cell:(row)=>(
                <>
                {row.isEditing ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => handleSave(row)}>
                      Save
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancelEdit(row)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={() => handleEdit(row)}>
                    Edit
                  </button>
                )}
                <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
                  Delete
                </button>
              </>
            )
        },
        

    ];
    const [data, setData]= useState([]);
    const [search, SetSearch]= useState('');
    const [filter, setFilter]= useState([]);
    /* The line `const [editableRow, setEditableRow] = useState(null);` is declaring a state variable
    called `editableRow` and a corresponding setter function `setEditableRow`. The initial value of
    `editableRow` is set to `null`. */
    // const [editableRow, setEditableRow] = useState(null);


    // const [currentPage, setCurrentPage] = useState(1);

    // const pageSize = 10;
  

    const getProduct=async()=>{
    try{
        const req= await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        const res= await req.json();
        const dataWithEditing = res.map((item) => ({ ...item, isEditing: false }));
      setData(dataWithEditing);
      setFilter(dataWithEditing);
    } catch(error){
       console.log(error);
    }
    }
    useEffect(()=>{
        getProduct();
    }, []);

    useEffect(()=>{
        const result= data.filter((item)=>{
            return Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(search.toLowerCase())
          );
        });
        setFilter(result);
        // setCurrentPage(1);
    },[search,data]);

    const contextActions=()=>{
        const handleDelete=(val)=>{
            const newdata= data.filter((item)=>item.id!==val);
            setFilter(newdata);
           }
           
    }
   const handleDelete=(val)=>{
    const newdata= data.filter((item)=>item.id!==val);
    setFilter(newdata);
   }
   
   const handleEdit = (row) => {
    // Set 'isEditing' to true for the selected row
    const newData = data.map((item) => (item.id === row.id ? { ...item, isEditing: true } : item));
    setData(newData);
   
  };

  const handleSave = (row) => {
    // Save the edited row
    const newData = data.map((item) =>
      item.id === row.id ? { ...item, isEditing: false } : item
    );
    setData(newData);
    setFilter(newData);
  };

  const handleCancelEdit = (row) => {
    // Cancel the edit mode
    const newData = data.map((item) =>
      item.id === row.id ? { ...item, isEditing: false } : item
    );
    setData(newData);
  };

//    const handlePageChange =(page)=> {
//     setCurrentPage(page);
//   };

  const handleInputChange = (id,field,value) => {
    // Update the edited value in the state
    const newData = data.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setData(newData);
  };


 


   const tableHeaderstyle={
    headCells:{
        style:{
            fontWeight:"bold",
            fontSize:"14px",
            backgroundColor:"#ccc"

        },
    },
   }

    return(
        <React.Fragment>
            <h1>Admin DashBoard</h1>
            
            <DataTable 
            customStyles={tableHeaderstyle}
            columns={columns}
            data={filter}
            pagination
            // paginationPerPage={pageSize}
            // paginationRowsPerPageOptions={[pageSize]}
            // paginationTotalRows={filter.length}
            // onChangePage={handlePageChange}
            selectableRows
            contextActions={contextActions}
            fixedHeader
            selectableRowsHighlight
            highlightOnHover
            actions={
                <div className="align-text-center">
                <button className="btn btn-danger" position="center">Delete</button>
                </div>
            }
            // actionsAlign=""
            subHeader
             subHeaderComponent={
                <input type="text"
                className="w-25 form-control"
                placeholder="Search..."
                value={ search}
                onChange={(e)=>SetSearch(e.target.value)}
                />
              
             }
             subHeaderAlign="left"
            
            />
        </React.Fragment>
    );
}
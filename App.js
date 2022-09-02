import { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css"


function Employees() {

  const [employees, setEmployees] = useState([])
  const [empName, setName] = useState("")
  const [empDesignation, setDesignation] = useState("")
  const [addFlag, setAddFlag] = useState(false)
  const [success, setSuccess] = useState("")
  const [msg, setMsg] = useState("")
  const [update, setUpdate] = useState(false)
  let [empToBeUpdated, setEmpToBeUpdated] = useState({ id: 0, name: "", designation: "" })


  useEffect(() => {
    axios.get('http://localhost:4000/employees').then((res) => {
      setEmployees(res.data)
    })
  })

  const deleteEmployee = (empId) => {
    axios.delete('http://localhost:4000/employees/' + empId).then((res) => {
      axios.get('http://localhost:4000/employees').then((res) => {
        setEmployees(res.data)
      })
    })
  }

  const addEmployee = (e) => {
    e.preventDefault()
    setSuccess("")
    if (empName === "" || empDesignation === "") {
      setMsg("Please enter valid values")
    }
    else {
      setMsg("")
      setAddFlag(false)
      let newEmployee = { name: empName, designation: empDesignation }
      axios.post('http://localhost:4000/employees', newEmployee).then((res) => {
        setEmployees([...employees, res.data])
        setSuccess(`New emp with id ${res.data.id} is added`)
      })
      setName("")
      setDesignation("")
    }


  }

  const findEmployee = (id) => {
    let emp = employees.find(
      function (el) {
        return el.id === id
      }
    )
    console.log(emp)
    setEmpToBeUpdated(emp)
  }
  const updateEmpl = (e) => {
    e.preventDefault()
    setUpdate(false)
    axios.put("http://localhost:4000/employees/" + empToBeUpdated.id, empToBeUpdated)
      .then((response) => {
        let index = employees.findIndex((employee) => employee.id === empToBeUpdated.id)
        let temp = [...employees];
        temp[index] = response.data
        setEmployees(temp)
        setMsg("Employee updated successfully! ")
      }
      ).catch(() => {
        setMsg("Something went wrong!")
      }
      )
  }

  return (
    <>
      <h1>Employee Data</h1>
      <table style={{ width: '60%' }} className="table table-bordered">
        <thead>
          <tr>
            <th>EmpId</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            employees.length > 0 ? (
              employees.map((emp) => {
                return (<tr>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.designation}</td>
                  <td><button onClick={() => deleteEmployee(emp.id)}>Delete</button></td>
                </tr>)
              })
            ) : null
          }
        </tbody>
      </table>
      <button onClick={() => setAddFlag(!addFlag)}>
        Add Employee
      </button>
      <div className='text-success'>{success}</div>
      {
        addFlag ? (<form>
          EmpName: <input type='text' value={empName}
            onChange={(e) => { setName(e.target.value) }} />
          Designation: <input type='text' value={empDesignation}
            onChange={(e) => { setDesignation(e.target.value) }} />
          <button onClick={addEmployee}>Add</button>
          <div className='text-danger'>{msg}</div>
        </form>

        ) : null
      }

      <p> <button onClick={() => { setUpdate(true) }}>Update Employee</button></p>

      {
        update ?
          <form>
            <p>Employee ID<br />
              <select onChange={(e) => { findEmployee(e.target.value) }}>
                <option value="">Select</option>
                {
                  employees.map(
                    (employee) => {
                      return <option key={employee.id} value={employee.id} >{employee.id}</option>
                    }
                  )
                }
              </select> </p>

            <p>Name <br />
              <input value={empToBeUpdated.name} onChange={(e) => { setEmpToBeUpdated({ ...empToBeUpdated, name: e.target.value }) }} /></p>
            <p>Designation<br />
              <input value={empToBeUpdated.designation} onChange={(e) => { setEmpToBeUpdated({ ...empToBeUpdated, designation: e.target.value }) }} /></p>
            <p> <button onClick={(e) => { updateEmpl(e) }}>Update</button></p>
          </form>
          : null
      }
      <p className='text-success'>{msg}</p>
    </>
  )
}
export default Employees;
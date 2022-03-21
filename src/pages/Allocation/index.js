import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";


import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";


const endpoint = "/allocations";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "course",
    id: "course",
    render: (course)=> course.name,
  },
  {
    value: "professor",
    id: "professor",
    render: (professor)=> professor.name,
  },
  {
    value: "DayOfWeek",
    id: "dayOfWeek",
  },
  {
    value: "StartHour",
    id: "startHour",
  },
  {
    value: "EndHour",
    id: "endHour",
  },
  
];

const INITIAL_STATE = { id: 0, name: "" };

const Allocation = () => {
  const [visible, setVisible] = useState(false);
  const [allocation, setAllocation] = useState(INITIAL_STATE);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);
  

  useEffect(() => {
    api
      .get("/professors")
      .then((response) => {
        setProfessors(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
    api
      .get("/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
     

  }, []);

  const handleSave = async (refetch) => {
    const data ={
      dayOfWeek : allocation.dayOfWeek,
      courseId : allocation.courseId,
      professorId : allocation.professorId,
      startHour : allocation.startHour,
      endtHour : allocation.endtHour,
    };
    try {
      if (allocation.id) {
        await api.put(`${endpoint}/${allocation.id}`, data  );

        toast.success("Atualizado com sucesso!");
      } else {
        await api.post(endpoint, { name: allocation.name });

        toast.success("Cadastrado com sucesso!");
      }

      setVisible(false);

      await refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const actions = [
    {
      name: "Edit",
      action: ({ id, professor: { id: professorId }, course: { id: courseId }, dayOfWeek, startHour, endHour, }) => {
        setAllocation({ id, professorId, courseId, dayOfWeek, startHour, endHour });
        setVisible(true);
      },
    },
    {
      name: "Remove",
      action: async (item, refetch) => {
        if (window.confirm("Você tem certeza que deseja remover?")) {
          try {
            await api.delete(`${endpoint}/${item.id}`);
            await refetch();
            toast.info(`${item.name} foi removido`);
          } catch (error) {
            toast.info(error.message);
          }
        }
      },
    },
  ];

  const onChange =({ target: {name,value}}) => {
    setAllocation({
        ...allocation,
        [name]: value,
    });
};

  return (
    <Page title="Allocation">
      <Button
        className="mb-2"
        onClick={() => {
          setAllocation(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Criar allocation
      </Button>
      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${allocation.id ? "Update" : "Create"} Allocation`}
            show={visible}
            handleClose={() => setVisible(false)}
            handleSave={() => handleSave(refetch)}
          >
            <Form>
                <Form.Group>
                            <Form.Group>
                                <Form.Label>Course Name</Form.Label>
                                    <select
                                    
                                    className="form-control"
                                    name="courseId"
                                    onChange={onChange}
                                    
                                    value={Allocation.courseId}
                                    >
                                      <option>Selecione o course</option>
                                      {courses.map((course, index) => (
                                        <option key={`um${index}`} value={course.id}>
                                          {course.name}
                                        </option>
                                      ))}
                                    </select>
                             </Form.Group>
                             <Form.Group>
                                <Form.Label>professor Name</Form.Label>
                                    <select
                                    
                                    className="form-control"
                                    name="professorId"
                                    onChange={onChange}
                                    
                                    value={Allocation.professorId}
                                    >
                                      <option>Selecione o profesor</option>
                                      {professors.map((professor, index) => (
                                        <option key={`${index}`} value={professor.id}>
                                          {professor.name}
                                        </option>
                                      ))}
                                    </select>
                             
                            
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Dia da Semana</Form.Label>
                                <Form.Control

                                    className="form-control"
                                    name="dayOfWeek"
                                    onChange={onChange}
                                    value={allocation.dayOfWeek}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>StartHour</Form.Label>
                                <Form.Control

                                    className="form-control"
                                    name="startHour"
                                    onChange={onChange}
                                    value={allocation.startHour}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>EndHour</Form.Label>
                                <Form.Control
                                
                                    className="form-control"
                                    name="endHour"
                                    onChange={onChange}
                                    value={allocation.endHour}
                                />
                            </Form.Group>
                            
                 </Form.Group>
                
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Allocation;
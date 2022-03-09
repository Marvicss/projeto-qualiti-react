import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";
import Courses from "../Courses";

const endpoint = "/professors";

const columns = [
    {
        value: "id",
        id: "id"
    }, {
        value: "name",
        id: "name"
    }, {
        value: "department",
        id: "department",
        render: (department) => department.name,
    }, {
        value: "cpf",
        id: "cpf"
    }
]

const INITIAL_STATE = { id: 0, name: "", departmentId: 0 , cpf: "" };

const Professor = () => {
    const [visible, setVisible] = useState(false);
    const [departments, setDepartments] = useState([])
    const [courses, setCourse] = useState([])
    const [Professor, setProfessor] = useState(INITIAL_STATE);

    useEffect(() => {
        api
          .get("/departments")
          .then((response) => {
            setDepartments(response.data);
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }, []);

    const handleSave = async (refetch) => {
        try {
            if (Professor.id) {
                await api.put(`${endpoint}/${Professor.id}`, {
                    name: Professor.name,
                    cpf: Professor.cpf,
                    departmentId : Professor.departmentId,
                });

                toast.success("Atualizado com sucesso!");
            } else {
                await api.post(endpoint, { name: Professor.name });

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
            action: (_Professor) => {
                setCourse(_Professor);
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

    return (
        <Page title="Professor">
          <Button
            className="mb-2"
            onClick={() => {
              setCourse(INITIAL_STATE);
              setVisible(true);
            }}
          >
            Criar Professor
          </Button>
          <ListView actions={actions} columns={columns} endpoint={endpoint}>
            {({ refetch }) => (
              <Modal
                title={`${Professor.id ? "Update" : "Create"} Professor`}
                show={visible}
                handleClose={() => setVisible(false)}
                handleSave={() => handleSave(refetch)}
              >
                <Form>
                  <Form.Group>
                    <Form.Label>Professor Name</Form.Label>
                    <Form.Control
                      name="Professor"
                      onChange={(event) =>
                        setProfessor({ ...Professor, name: event.target.value })
                      }
                      value={Professor.name}
                    />
                  </Form.Group>
                </Form>
              </Modal>
            )}
          </ListView>
        </Page>
      );
};


export default Professor;

import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";


import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";


const endpoint = "/department";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "Name",
    id: "name",
  },
  {
    value: "DayOfWeek",
    id: "Id",
  },
  {
    value: "StartHour",
    id: "Id",
  },
  {
    value: "EndHour",
    id: "Id",
  },
  {
    value: "departamentId",
      id: "departamentId",
      render: (departamentId)=> departamentId.name,  
  },
  {
    value: "professor",
    id: "professorId",
    render: (professorId)=> professorId.name,
  },
  {
    value: "course",
    id: "courseId",
    render: (courseId)=> courseId.name,
  },
];

const INITIAL_STATE = { id: 0, name: "" };

const Allocation = () => {
  const [visible, setVisible] = useState(false);
  const [Allocation, setAllocation] = useState(INITIAL_STATE);

  const handleSave = async (refetch) => {
    try {
      if (Allocation.id) {
        await api.put(`${endpoint}/${Allocation.id}`, {
          name: Allocation.name,
        });

        toast.success("Atualizado com sucesso!");
      } else {
        await api.post(endpoint, { name: Allocation.name });

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
      action: (_allocation) => {
        setAllocation(_allocation);
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
    <Page title="Allocation">
      <Button
        className="mb-2"
        onClick={() => {
          setAllocation(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Criar Curso
      </Button>
      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${Allocation.id ? "Update" : "Create"} Allocation`}
            show={visible}
            handleClose={() => setVisible(false)}
            handleSave={() => handleSave(refetch)}
          >
            <Form>
              <Form.Group>
                <Form.Label>Allocation Name</Form.Label>
                <Form.Control
                  name="Allocation"
                  onChange={(event) =>
                    setAllocation({ ...Allocation, name: event.target.value })
                  }
                  value={Allocation.name}
                />
              </Form.Group>
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Allocation;
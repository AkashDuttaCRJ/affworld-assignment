import { useGetAllTasks } from "@/api/task";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BoardData } from "@/types/task";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";

export default function TaskManagementPage() {
  const [data, setData] = useState<BoardData>({ data: [] });

  const { data: tasks, refetch } = useGetAllTasks();

  useEffect(() => {
    if (tasks) {
      setData(tasks);
    }
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If the drop is outside any droppable area, do nothing
    if (!destination) return;

    setData((prevData) => {
      // Copy existing data
      const newColumns = [...prevData.data];

      // Find source and destination columns
      const sourceColumnIndex = newColumns.findIndex(
        (column) => column._id === source.droppableId
      );
      const destColumnIndex = newColumns.findIndex(
        (column) => column._id === destination.droppableId
      );

      // If source or destination columns aren't found, do nothing
      if (sourceColumnIndex === -1 || destColumnIndex === -1) return prevData;

      const sourceColumn = newColumns[sourceColumnIndex];
      const destColumn = newColumns[destColumnIndex];

      // If dropped in the same column, reorder tasks
      if (source.droppableId === destination.droppableId) {
        const newTaskList = [...sourceColumn.tasks];
        const [movedTask] = newTaskList.splice(source.index, 1);
        newTaskList.splice(destination.index, 0, movedTask);

        // Update the specific column's tasks
        newColumns[sourceColumnIndex] = {
          ...sourceColumn,
          tasks: newTaskList,
        };

        return { ...prevData, data: newColumns };
      }

      // If moved to a different column
      const sourceTasks = [...sourceColumn.tasks];
      const destTasks = [...destColumn.tasks];

      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);

      // Update columns with modified task lists
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: sourceTasks,
      };

      newColumns[destColumnIndex] = {
        ...destColumn,
        tasks: destTasks,
      };

      return { ...prevData, data: newColumns };
    });
  };

  return (
    <div className="container mx-auto space-y-6 p-8">
      <h1 className="text-4xl font-bold mb-4">Task Management</h1>
      <div className="flex justify-end">
        <CreateTaskDialog
          columns={
            tasks?.data?.map((column) => ({
              id: column._id,
              title: column.name,
            })) || []
          }
          onCreateTaskCallback={() => {
            refetch();
          }}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {data.data.map((column) => {
            return (
              <div
                key={column._id}
                className="bg-gray-100 p-4 rounded-lg w-1/3"
              >
                <h2 className="text-lg font-bold mb-2">{column.name}</h2>

                <Droppable droppableId={column._id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col gap-2 h-full"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              <Card className="mb-4 transition-all duration-300 ease-in-out hover:shadow-lg">
                                <CardHeader className="pb-2">
                                  <CardTitle className="font-semibold text-gray-800">
                                    {task.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-gray-600">
                                    {task.description}
                                  </p>
                                </CardContent>
                                <CardFooter className="flex flex-col items-start gap-2">
                                  <div className="flex items-center text-gray-500 text-xs">
                                    <span className="mr-2">
                                      {formatDistanceToNowStrict(
                                        new Date(task.createdAt),
                                        { addSuffix: true }
                                      )}
                                    </span>
                                  </div>
                                </CardFooter>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

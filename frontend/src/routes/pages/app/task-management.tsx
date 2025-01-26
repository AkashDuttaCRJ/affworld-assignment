import { useGetAllTasks } from "@/api/task";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axios } from "@/lib/axios";
import { BoardData } from "@/types/task";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TaskManagementPage() {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [data, setData] = useState<BoardData>({ data: [] });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: tasks, refetch } = useGetAllTasks();

  const { mutate: updateTask } = useMutation({
    mutationFn: (data: {
      taskId: string;
      columnId: string;
      tasksOrder: string[];
    }) => {
      return axios.patch(`/tasks/${data.taskId}`, {
        columnId: data.columnId,
        tasksOrder: data.tasksOrder,
      });
    },
  });

  const { mutate: deleteTask, isPending: loading } = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => {
      return axios.delete(`/tasks/${taskId}`);
    },
  });

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

        // Call API to update the task order
        updateTask({
          taskId: movedTask._id,
          columnId: sourceColumn._id,
          tasksOrder: newTaskList.map((task) => task._id),
        });

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

      // Call API to update task movement to the new column
      updateTask({
        taskId: movedTask._id,
        columnId: destColumn._id,
        tasksOrder: destTasks.map((task) => task._id),
      });

      return { ...prevData, data: newColumns };
    });
  };

  const handleDelete = (taskId: string) => {
    deleteTask(
      { taskId },
      {
        onSuccess: () => {
          refetch();
          setIsDeleteDialogOpen(false);
          toast.success("Task deleted successfully");
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
          }
        },
      }
    );
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
                              onMouseEnter={() => setHoveredTaskId(task._id)}
                              onMouseLeave={() => setHoveredTaskId(null)}
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
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center text-gray-500 text-xs">
                                      <span className="mr-2">
                                        {formatDistanceToNowStrict(
                                          new Date(task.createdAt),
                                          { addSuffix: true }
                                        )}
                                      </span>
                                    </div>
                                    {task._id === hoveredTaskId && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <AlertDialog
                                              open={isDeleteDialogOpen}
                                              onOpenChange={(open) => {
                                                setIsDeleteDialogOpen(open);
                                                setHoveredTaskId(null);
                                              }}
                                            >
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground hover:text-destructive-foreground"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Are you sure you want to
                                                    delete this task?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete the task
                                                    and remove it from our
                                                    servers.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel
                                                    disabled={loading}
                                                  >
                                                    Cancel
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    disabled={loading}
                                                    onClick={() =>
                                                      handleDelete(task._id)
                                                    }
                                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground hover:text-destructive-foreground"
                                                  >
                                                    {loading ? (
                                                      <LoaderCircle className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                      "Delete"
                                                    )}
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Delete task</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
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

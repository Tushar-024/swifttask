"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";
import { ArrowUpDown, PenSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { TaskForm } from "./components/task-form";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: "Pending" | "Completed";
  startTime: string;
  endTime: string;
  totalTime: number;
  completed: boolean;
};

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<
    "Pending" | "Completed" | null
  >(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/tasks");
        console.log(response.data.data);
        setTasks(response.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tasks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddTask = async (values: {
    title: string;
    description: string;
    priority: string;
    startTime: Date;
    endTime: Date;
  }) => {
    try {
      const taskData = {
        ...values,
        status: "Pending" as const,
      };

      const response = await axiosInstance.post("/tasks", taskData);
      const newTask = response.data.data;

      setTasks([...tasks, newTask]);
      setIsAddDialogOpen(false);
      toast({
        title: "Task created",
        description: "New task has been created successfully.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async (values: {
    title: string;
    description: string;
    priority: string;
    startTime: Date;
    endTime: Date;
  }) => {
    if (!editingTask) return;
    try {
      const response = await axiosInstance.patch(`/tasks/${editingTask._id}`, values);

      const updatedTask = response.data.data;

      setTasks(
        tasks.map((task) => (task._id === editingTask._id ? updatedTask : task))
      );
      setIsEditDialogOpen(false);
      setEditingTask(null);
      toast({
        title: "Task updated",
        description: "Task has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTasks = async () => {
    try {
      await Promise.all(
        selectedTasks.map((_id) => axiosInstance.delete(`/tasks/${_id}`))
      );
      setTasks(tasks.filter((task) => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Tasks deleted",
        description: `${selectedTasks.length} task(s) have been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tasks",
        variant: "destructive",
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "Completed" : "Pending",
            }
          : task
      )
    );
    const response = await axiosInstance.patch(`/tasks/${taskId}`, {
      status: !tasks.find((task) => task._id === taskId)?.completed
        ? "Completed"
        : "Pending",
    });
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => !statusFilter || task.status === statusFilter)
    .filter((task) => !priorityFilter || task.priority === priorityFilter)
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Task list</h1>

      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant="outline"
            className="border-dashed"
            onClick={() => setIsAddDialogOpen(true)}
          >
            + Add task
          </Button>
          <Button
            variant="destructive"
            disabled={selectedTasks.length === 0}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete selected
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("startTime")}>
                Start time:{" "}
                {sortField === "startTime"
                  ? sortDirection.toUpperCase()
                  : "ASC"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("endTime")}>
                End time:{" "}
                {sortField === "endTime" ? sortDirection.toUpperCase() : "ASC"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Priority{" "}
                {priorityFilter === null
                  ? ": All"
                  : priorityFilter
                  ? `: ${priorityFilter}`
                  : ""}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                All
              </DropdownMenuItem>
              {[1, 2, 3, 4, 5].map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  onClick={() =>
                    setPriorityFilter(
                      priorityFilter === String(priority)
                        ? null
                        : String(priority)
                    )
                  }
                >
                  {priority}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status: {statusFilter || "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedTasks.length === filteredAndSortedTasks.length &&
                    filteredAndSortedTasks.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTasks(
                        filteredAndSortedTasks.map((task) => task._id)
                      );
                    } else {
                      setSelectedTasks([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Task ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Total time to finish (hrs)</TableHead>
              <TableHead className="w-12">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.includes(task._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTasks([...selectedTasks, task._id]);
                      } else {
                        setSelectedTasks(
                          selectedTasks.filter((_id) => _id !== task._id)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{task._id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={task.status == "Completed" ? true : false}
                    onCheckedChange={() => toggleTaskCompletion(task._id)}
                  />
                </TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.startTime}</TableCell>
                <TableCell>{task.endTime}</TableCell>
                <TableCell>{task.totalTime}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingTask(task);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <PenSquare className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              initialData={editingTask}
              onSubmit={handleEditTask}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedTasks.length} selected
              task(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTasks}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

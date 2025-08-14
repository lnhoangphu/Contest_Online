import { Request, Response } from "express";
import { logger } from "@/utils/logger";
import { errorResponse, successResponse } from "@/utils/response";
import UserService from "./user.service";
import { validateData } from "@/middlewares/validation";

export default class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, isActive, role } = req.query;
      const queryInput = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        role: role as string
      };
      
      const result = await UserService.getAllUser(queryInput);
      res.json(successResponse(result, "Lấy danh sách người dùng thành công"));
      logger.info("Lấy danh sách người dùng thành công");
    } catch (error) {
      logger.error((error as Error).message);
      res.status(500).json(errorResponse((error as Error).message));
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(parseInt(id));
      
      if (!user) {
        res.status(404).json(errorResponse("Người dùng không tồn tại"));
        return;
      }

      res.json(successResponse(user, "Lấy thông tin người dùng thành công"));
      logger.info(`Lấy thông tin người dùng ID: ${id} thành công`);
    } catch (error) {
      logger.error((error as Error).message);
      res.status(500).json(errorResponse((error as Error).message));
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedUser = await UserService.UpdateUser(parseInt(id), updateData);
      
      if (!updatedUser) {
        res.status(404).json(errorResponse("Người dùng không tồn tại"));
        return;
      }

      res.json(successResponse(updatedUser, "Cập nhật người dùng thành công"));
      logger.info(`Cập nhật người dùng ID: ${id} thành công`);
    } catch (error) {
      logger.error((error as Error).message);
      res.status(500).json(errorResponse((error as Error).message));
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const deletedUser = await UserService.deleteUser(parseInt(id));
      
      if (!deletedUser) {
        res.status(404).json(errorResponse("Người dùng không tồn tại"));
        return;
      }

      res.json(successResponse(deletedUser, "Xóa người dùng thành công"));
      logger.info(`Xóa người dùng ID: ${id} thành công`);
    } catch (error) {
      logger.error((error as Error).message);
      res.status(500).json(errorResponse((error as Error).message));
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json(errorResponse("Không có thông tin người dùng"));
        return;
      }

      const user = await UserService.getUserById(userId);
      
      if (!user) {
        res.status(404).json(errorResponse("Người dùng không tồn tại"));
        return;
      }

      res.json(successResponse(user, "Lấy thông tin người dùng hiện tại thành công"));
      logger.info(`Lấy thông tin người dùng hiện tại ID: ${userId} thành công`);
    } catch (error) {
      logger.error((error as Error).message);
      res.status(500).json(errorResponse((error as Error).message));
    }
  }
}

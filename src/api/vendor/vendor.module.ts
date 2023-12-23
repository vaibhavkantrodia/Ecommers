import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { Vendor, VendorSchema } from './schema/vendor.schema';
import { ErrorHandlerService } from 'src/utils/error-handler.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }])],
  controllers: [VendorController],
  providers: [VendorService, ErrorHandlerService],
  exports: [VendorService]
})
export class VendorModule { }

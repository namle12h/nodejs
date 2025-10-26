
/* =======================
   1) Core
   ======================= */
CREATE TABLE dbo.Branch (
  Id         BIGINT IDENTITY(1,1) PRIMARY KEY,
  Name       NVARCHAR(200) NOT NULL,
  Address    NVARCHAR(500) NULL,
  Active     BIT NOT NULL DEFAULT (1),
  CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE dbo.Customer (
  Id         BIGINT IDENTITY(1,1) PRIMARY KEY,
  BranchId   BIGINT NOT NULL,
  Name       NVARCHAR(200) NOT NULL,
  Phone      NVARCHAR(32) NULL,
  Email      NVARCHAR(320) NULL,
  Dob        DATE NULL,
  Notes      NVARCHAR(MAX) NULL,
  CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
  CONSTRAINT FK_Customer_Branch FOREIGN KEY (BranchId) REFERENCES dbo.Branch(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Staff (
  Id         BIGINT IDENTITY(1,1) PRIMARY KEY,
  BranchId   BIGINT NOT NULL,
  Name       NVARCHAR(200) NOT NULL,
  Phone      NVARCHAR(32) NULL,
  Email      NVARCHAR(320) NULL,
  HireDate   DATE NULL,
  Status     NVARCHAR(20) NOT NULL DEFAULT N'ACTIVE',
  CONSTRAINT FK_Staff_Branch FOREIGN KEY (BranchId) REFERENCES dbo.Branch(Id) ON DELETE CASCADE
);
GO

/* =======================
   2) Services & Products
   ======================= */
CREATE TABLE dbo.ServiceCategory (
  Id    BIGINT IDENTITY(1,1) PRIMARY KEY,
  Name  NVARCHAR(200) NOT NULL
);
GO

CREATE TABLE dbo.Service (
  Id               BIGINT IDENTITY(1,1) PRIMARY KEY,
  ServiceCategoryId BIGINT NULL,
  Name             NVARCHAR(200) NOT NULL,
  Price            DECIMAL(12,2) NOT NULL DEFAULT (0),
  DurationMin      INT NOT NULL DEFAULT (60),
  Active           BIT NOT NULL DEFAULT (1),
  CONSTRAINT FK_Service_Category FOREIGN KEY (ServiceCategoryId) REFERENCES dbo.ServiceCategory(Id) ON DELETE SET NULL
);
GO

CREATE TABLE dbo.Product (
  Id        BIGINT IDENTITY(1,1) PRIMARY KEY,
  Sku       NVARCHAR(64) NOT NULL UNIQUE,
  Name      NVARCHAR(200) NOT NULL,
  Uom       NVARCHAR(16) NOT NULL,   -- ml, g, pcs...
  Active    BIT NOT NULL DEFAULT (1)
);
GO

/* =======================
   3) Resources & Booking
   ======================= */
-- Resource.Type = 'THERAPIST' | 'ROOM' | 'DEVICE'
CREATE TABLE dbo.Resource (
  Id        BIGINT IDENTITY(1,1) PRIMARY KEY,
  BranchId  BIGINT NOT NULL,
  Name      NVARCHAR(200) NOT NULL,
  Type      NVARCHAR(20) NOT NULL,
  Active    BIT NOT NULL DEFAULT (1),
  CONSTRAINT FK_Resource_Branch FOREIGN KEY (BranchId) REFERENCES dbo.Branch(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Appointment (
  Id         BIGINT IDENTITY(1,1) PRIMARY KEY,
  BranchId   BIGINT NOT NULL,
  CustomerId BIGINT NOT NULL,
  StartAt    DATETIME2(0) NOT NULL,
  EndAt      DATETIME2(0) NOT NULL,
  Status     NVARCHAR(20) NOT NULL DEFAULT N'CONFIRMED',
  Notes      NVARCHAR(MAX) NULL,
  CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
  CONSTRAINT CK_Appointment_Time CHECK (EndAt > StartAt),
  CONSTRAINT FK_Appointment_Branch FOREIGN KEY (BranchId) REFERENCES dbo.Branch(Id) ON DELETE CASCADE,
  CONSTRAINT FK_Appointment_Customer FOREIGN KEY (CustomerId) REFERENCES dbo.Customer(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.AppointmentService (
  Id              BIGINT IDENTITY(1,1) PRIMARY KEY,
  AppointmentId   BIGINT NOT NULL,
  ServiceId       BIGINT NOT NULL,
  Price           DECIMAL(12,2) NOT NULL DEFAULT (0),
  DurationMin     INT NOT NULL,
  Status          NVARCHAR(20) NOT NULL DEFAULT N'PLANNED',
  CONSTRAINT FK_AppSvc_Appointment FOREIGN KEY (AppointmentId) REFERENCES dbo.Appointment(Id) ON DELETE CASCADE,
  CONSTRAINT FK_AppSvc_Service FOREIGN KEY (ServiceId) REFERENCES dbo.Service(Id) ON DELETE NO ACTION
);
GO

CREATE TABLE dbo.BookingAssignment (
  Id                    BIGINT IDENTITY(1,1) PRIMARY KEY,
  AppointmentServiceId  BIGINT NOT NULL,
  ResourceId            BIGINT NOT NULL,
  StartAt               DATETIME2(0) NOT NULL,
  EndAt                 DATETIME2(0) NOT NULL,
  CONSTRAINT CK_Booking_Time CHECK (EndAt > StartAt),
  CONSTRAINT FK_Booking_AppSvc FOREIGN KEY (AppointmentServiceId) REFERENCES dbo.AppointmentService(Id) ON DELETE CASCADE,
  CONSTRAINT FK_Booking_Resource FOREIGN KEY (ResourceId) REFERENCES dbo.Resource(Id) ON DELETE NO ACTION
);
GO

/* =======================
   4) Billing
   ======================= */
CREATE TABLE dbo.Invoice (
  Id            BIGINT IDENTITY(1,1) PRIMARY KEY,
  BranchId      BIGINT NOT NULL,
  CustomerId    BIGINT NULL,
  AppointmentId BIGINT NULL,
  Subtotal      DECIMAL(12,2) NOT NULL DEFAULT (0),
  Discount      DECIMAL(12,2) NOT NULL DEFAULT (0),
  Tax           DECIMAL(12,2) NOT NULL DEFAULT (0),
  Total         DECIMAL(12,2) NOT NULL DEFAULT (0),
  Status        NVARCHAR(20) NOT NULL DEFAULT N'OPEN',
  CreatedAt     DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
  CONSTRAINT FK_Invoice_Branch FOREIGN KEY (BranchId) REFERENCES dbo.Branch(Id) ON DELETE CASCADE,
  CONSTRAINT FK_Invoice_Customer FOREIGN KEY (CustomerId) REFERENCES dbo.Customer(Id) ON DELETE SET NULL,
  CONSTRAINT FK_Invoice_Appointment FOREIGN KEY (AppointmentId) REFERENCES dbo.Appointment(Id) ON DELETE SET NULL
);
GO

-- ItemType = 'SERVICE' | 'PRODUCT' | 'FEE'
CREATE TABLE dbo.InvoiceItem (
  Id          BIGINT IDENTITY(1,1) PRIMARY KEY,
  InvoiceId   BIGINT NOT NULL,
  ItemType    NVARCHAR(20) NOT NULL,
  RefId       BIGINT NULL,
  Name        NVARCHAR(200) NOT NULL,
  Qty         DECIMAL(12,3) NOT NULL DEFAULT (1),
  UnitPrice   DECIMAL(12,2) NOT NULL DEFAULT (0),
  LineTotal   DECIMAL(12,2) NOT NULL DEFAULT (0),
  CONSTRAINT FK_InvoiceItem_Invoice FOREIGN KEY (InvoiceId) REFERENCES dbo.Invoice(Id) ON DELETE CASCADE
);
GO

-- Method = 'CASH' | 'CARD' | 'QR' | 'TRANSFER'
CREATE TABLE dbo.Payment (
  Id         BIGINT IDENTITY(1,1) PRIMARY KEY,
  InvoiceId  BIGINT NOT NULL,
  Method     NVARCHAR(20) NOT NULL,
  Amount     DECIMAL(12,2) NOT NULL,
  PaidAt     DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
  CONSTRAINT FK_Payment_Invoice FOREIGN KEY (InvoiceId) REFERENCES dbo.Invoice(Id) ON DELETE CASCADE
);
GO

/* =======================
   5) Inventory
   ======================= */
CREATE TABLE dbo.StockBatch (
  Id         BIGINT IDENTITY(1,1) PRIMARY KEY,
  ProductId  BIGINT NOT NULL,
  BranchId   BIGINT NOT NULL,
  Lot        NVARCHAR(50) NULL,
  ExpDate    DATE NULL,
  QtyOnHand  DECIMAL(14,3) NOT NULL DEFAULT (0),
  CONSTRAINT FK_StockBatch_Product FOREIGN KEY (ProductId) REFERENCES dbo.Product(Id) ON DELETE NO ACTION,
  CONSTRAINT FK_StockBatch_Branch FOREIGN KEY (BranchId) REFERENCES dbo.Branch(Id) ON DELETE CASCADE
);
GO

-- TxnType = 'IN' | 'OUT' | 'ADJUST' | 'CONSUME'
CREATE TABLE dbo.StockTxn (
  Id         BIGINT IDENTITY(1,1) PRIMARY KEY,
  BranchId   BIGINT NOT NULL,
  ProductId  BIGINT NOT NULL,
  BatchId    BIGINT NULL,
  TxnType    NVARCHAR(20) NOT NULL,
  Qty        DECIMAL(14,3) NOT NULL,
  CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
  CONSTRAINT FK_StockTxn_Branch FOREIGN KEY (BranchId) REFERENCES dbo.Branch(Id) ON DELETE CASCADE,
  CONSTRAINT FK_StockTxn_Product FOREIGN KEY (ProductId) REFERENCES dbo.Product(Id) ON DELETE NO ACTION,
  CONSTRAINT FK_StockTxn_Batch FOREIGN KEY (BatchId) REFERENCES dbo.StockBatch(Id) ON DELETE SET NULL
);
GO

